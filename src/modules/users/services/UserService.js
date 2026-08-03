const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../repositories/UserRepository');

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

      return await UserRepository.create({
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
      });
    } catch (error) {
      const filePathToDelete = processedAvatarPath || file?.path;

      if (filePathToDelete) {
        try {
          await storageProvider.delete(filePathToDelete);
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

    try {
      const updateData = {};

      if (data.first_name !== undefined) {
        updateData.first_name = data.first_name;
      }

      if (data.last_name !== undefined) {
        updateData.last_name = data.last_name;
      }

      if (data.phone !== undefined) {
        const phone = data.phone.replace(/\D/g, '');

        const existingPhone = await UserRepository.findByPhone(phone);

        if (existingPhone && existingPhone.id !== user.id) {
          throw new AppError('Phone is already registered.', 409);
        }

        if (phone !== user.phone) {
          updateData.phone = phone;

          updateData.is_phone_verified = false;
        }
      }

      if (file) {
        processedAvatarPath = await avatarProcessor.process(file.path);

        updateData.avatar_path = processedAvatarPath;
      }

      const previousAvatarPath = user.avatar_path;

      const updatedUser = await UserRepository.update(user, updateData);

      if (processedAvatarPath && previousAvatarPath) {
        try {
          await storageProvider.delete(previousAvatarPath);
        } catch (cleanupError) {
          cleanupError.userId = user.id;

          cleanupError.filePath = previousAvatarPath;

          console.error({
            name: cleanupError.name,
            message: cleanupError.message,
            userId: cleanupError.userId,
            filePath: cleanupError.filePath,
          });
        }
      }

      return updatedUser;
    } catch (error) {
      const filePathToDelete = processedAvatarPath || file?.path;

      if (filePathToDelete) {
        try {
          await storageProvider.delete(filePathToDelete);
        } catch (cleanupError) {
          error.cleanupError = cleanupError;
        }
      }

      throw error;
    }
  }

  async remove({ authenticatedUserId, userId }) {
    if (authenticatedUserId !== userId) {
      throw new AppError('You are not allowed to delete this user.', 403);
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    await UserRepository.softDelete(user);

    return {
      message: 'User deleted successfully.',
    };
  }
}

module.exports = new UserService();
