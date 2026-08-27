const database = require('../../../database');

const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../repositories/UserRepository');
const UserRefreshTokenRepository = require('../../auth/repositories/UserRefreshTokenRepository');

const AccountVerificationService = require('./AccountVerificationService');

const avatarProcessor = require('../providers/avatar.processor');

const storageProvider = require('../../../shared/providers/storage/local.provider');
const { hashPassword } = require('../../../shared/providers/hash/bcrypt.provider');

class UserService {
  async create({ data, file }) {
    let processedAvatarPath = null;

    try {
      const email = data.email.trim().toLowerCase();
      const cpf = data.cpf.replace(/\D/g, '');
      const phone = data.phone ? data.phone.replace(/\D/g, '') : null;
      const existingEmail = await UserRepository.findByEmail(email);

      if (existingEmail) {
        throw new AppError('Email is already registered.', 409);
      }

      const existingCpf = await UserRepository.findByCpf(cpf);
      if (existingCpf) {
        throw new AppError('CPF is already registered.', 409);
      }

      if (phone) {
        const existingPhone = await UserRepository.findByPhone(phone);
        if (existingPhone) {
          throw new AppError('Phone is already registered.', 409);
        }
      }

      const passwordHash = await hashPassword(data.password);

      if (file) {
        processedAvatarPath = await avatarProcessor.process(file.path);
      }

      let user;
      let verification;

      await database.transaction(async (transaction) => {
        user = await UserRepository.create(
          {
            first_name: data.first_name,
            last_name: data.last_name,
            email,
            password_hash: passwordHash,
            phone,
            cpf,
            avatar_path: processedAvatarPath,
            is_email_verified: false,
            is_phone_verified: false,
            is_active: true,
            failed_login_attempts: 0,
            locked_until: null,
          },
          {
            transaction,
          }
        );

        verification = await AccountVerificationService.prepareInitialVerification({
          user,
          transaction,
        });
      });

      await AccountVerificationService.dispatchInitialVerification({
        user,
        verification,
      });

      return user;
    } catch (error) {
      if (processedAvatarPath) {
        try {
          await storageProvider.delete(processedAvatarPath);
        } catch (cleanupError) {
          error.cleanupError = cleanupError;
        }
      } else if (file?.path) {
        try {
          await storageProvider.delete(file.path);
        } catch (cleanupError) {
          error.cleanupError = cleanupError;
        }
      }

      throw error;
    }
  }

  async getById({ authenticatedUserId, userId }) {
    if (authenticatedUserId !== userId) {
      throw new AppError('You are not allowed to access this user.', 403);
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    return user;
  }

  async update({ authenticatedUserId, userId, data, file }) {
    if (authenticatedUserId !== userId) {
      throw new AppError('You are not allowed to update this user.', 403);
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    let processedAvatarPath = null;
    let emailVerification = null;
    let phoneVerification = null;

    try {
      const updateData = {};

      let emailChanged = false;
      let phoneChanged = false;

      if (data.email !== undefined && data.email !== user.email) {
        const existingEmail = await UserRepository.findByEmail(data.email);

        if (existingEmail && existingEmail.id !== user.id) {
          throw new AppError('Email is already registered.', 409);
        }

        emailChanged = true;
        updateData.email = data.email;
        updateData.is_email_verified = false;
      }

      if (data.phone !== undefined) {
        const phone = data.phone.replace(/\D/g, '');

        if (phone !== user.phone) {
          const existingPhone = await UserRepository.findByPhone(phone);

          if (existingPhone && existingPhone.id !== user.id) {
            throw new AppError('Phone is already registered.', 409);
          }

          phoneChanged = true;
          updateData.phone = phone;
          updateData.is_phone_verified = false;
        }
      }

      if (file) {
        processedAvatarPath = await avatarProcessor.process(file.path);
        updateData.avatar_path = processedAvatarPath;
      }

      const previousAvatarPath = user.avatar_path;

      let updatedUser;

      await database.transaction(async (transaction) => {
        updatedUser = await UserRepository.update(user, updateData, {
          transaction,
        });

        if (emailChanged) {
          emailVerification = await AccountVerificationService.prepareEmailVerification({
            user: updatedUser,
            transaction,
          });

          await UserRefreshTokenRepository.deleteAllByUserId(updatedUser.id, {
            transaction,
          });
        }

        if (phoneChanged) {
          phoneVerification = await AccountVerificationService.preparePhoneVerification({
            user: updatedUser,
            transaction,
          });
        }
      });

      if (emailVerification) {
        await AccountVerificationService.dispatchEmailVerification({
          user: updatedUser,
          verification: emailVerification,
        });
      }

      if (phoneVerification) {
        await AccountVerificationService.dispatchPhoneVerification({
          user: updatedUser,
          verification: phoneVerification,
        });
      }

      if (processedAvatarPath && previousAvatarPath) {
        try {
          await storageProvider.delete(previousAvatarPath);
        } catch (cleanupError) {
          console.error({
            event: 'previous_avatar_cleanup_failed',
            userId: user.id,
            error: {
              name: cleanupError.name,
              message: cleanupError.message,
            },
          });
        }
      }

      return updatedUser;
    } catch (error) {
      if (processedAvatarPath) {
        try {
          await storageProvider.delete(processedAvatarPath);
        } catch (cleanupError) {
          error.cleanupError = cleanupError;
        }
      } else if (file?.path) {
        try {
          await storageProvider.delete(file.path);
        } catch (cleanupError) {
          error.cleanupError = cleanupError;
        }
      }

      throw error;
    }
  }
}

module.exports = new UserService();
