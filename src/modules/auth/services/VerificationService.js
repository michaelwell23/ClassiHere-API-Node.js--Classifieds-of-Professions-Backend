const database = require('../../../database');

const AppError = require('../../../shared/errors/AppError');

const authConfig = require('../../../config/auth');

const UserRepository = require('../../users/repositories/UserRepository');

const UserVerificationRepository = require('../repositories/UserVerificationRepository');
const UserPhoneVerificationRepository = require('../repositories/UserPhoneVerificationRepository');

const SendVerificationEmailService = require('../mail/SendVerificationEmailService');

const phoneProvider = require('../../../shared/providers/phone/local.provider');

const { generateOpaqueToken, hashOpaqueToken } = require('../providers/opaque-token.provider');

const {
  generatePhoneVerificationCode,
  hashPhoneVerificationCode,
  comparePhoneVerificationCode,
} = require('../providers/phone-verification-code.provider');

const resendEmailResponse = {
  message: 'If the account still requires verification, a new email has been sent.',
};

class VerificationService {
  async verifyEmail({ token }) {
    const tokenHash = hashOpaqueToken(token);

    const verification = await UserVerificationRepository.findActiveByTokenHash(tokenHash);

    if (!verification) {
      throw new AppError('Invalid or expired verification token.', 400);
    }

    const user = await UserRepository.findById(verification.user_id);

    if (!user) {
      throw new AppError('Invalid or expired verification token.', 400);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    if (user.is_email_verified) {
      await UserVerificationRepository.invalidateAllByUserId(user.id);

      return {
        message: 'Email is already verified.',
      };
    }

    await database.transaction(async (transaction) => {
      const consumed = await UserVerificationRepository.markAsUsed(verification.id, {
        transaction,
      });

      if (!consumed) {
        throw new AppError('Verification token has already been used.', 400);
      }

      await UserRepository.update(
        user,
        {
          is_email_verified: true,
        },
        {
          transaction,
        }
      );

      await UserVerificationRepository.invalidateOthersByUserId(user.id, verification.id, {
        transaction,
      });
    });

    return {
      message: 'Email verified successfully.',
    };
  }

  async resendEmail({ email }) {
    const user = await UserRepository.findByEmail(email);

    if (!user || !user.is_active || user.is_email_verified) {
      return resendEmailResponse;
    }

    const token = generateOpaqueToken();

    const verification = await UserVerificationRepository.create({
      user_id: user.id,
      token_hash: hashOpaqueToken(token),
      expires_at: new Date(
        Date.now() + authConfig.emailVerification.expiresInHours * 60 * 60 * 1000
      ),
    });

    try {
      await SendVerificationEmailService.execute({
        user,
        token,
      });
    } catch (error) {
      try {
        await UserVerificationRepository.deleteById(verification.id);
      } catch (cleanupError) {
        error.cleanupError = cleanupError;
      }

      throw error;
    }

    await UserVerificationRepository.invalidateOthersByUserId(user.id, verification.id);

    return resendEmailResponse;
  }

  async sendPhoneCode({ authenticatedUserId }) {
    const user = await UserRepository.findById(authenticatedUserId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    if (!user.phone) {
      throw new AppError('User does not have a phone number.', 400);
    }

    if (user.is_phone_verified) {
      return {
        message: 'Phone number is already verified.',
      };
    }

    const recentThreshold = new Date(
      Date.now() - authConfig.phoneVerification.resendIntervalSeconds * 1000
    );

    const recentVerification = await UserPhoneVerificationRepository.findRecentPendingByUserId(
      user.id,
      recentThreshold
    );

    if (recentVerification) {
      throw new AppError('Please wait before requesting another verification code.', 429);
    }

    const code = generatePhoneVerificationCode();

    const verification = await UserPhoneVerificationRepository.create({
      user_id: user.id,
      code_hash: hashPhoneVerificationCode(code),
      expires_at: new Date(Date.now() + authConfig.phoneVerification.expiresInMinutes * 60 * 1000),
      attempts: 0,
      verified_at: null,
    });

    try {
      await phoneProvider.send({
        phone: user.phone,
        code,
        expiresAt: verification.expires_at,
      });
    } catch (error) {
      try {
        await UserPhoneVerificationRepository.deleteById(verification.id);
      } catch (cleanupError) {
        error.cleanupError = cleanupError;
      }

      throw error;
    }

    await UserPhoneVerificationRepository.invalidatePendingByUserIdExcept(user.id, verification.id);

    return {
      message: 'Verification code sent successfully.',
    };
  }

  async verifyPhone({ authenticatedUserId, code }) {
    const user = await UserRepository.findById(authenticatedUserId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    if (!user.phone) {
      throw new AppError('User does not have a phone number.', 400);
    }

    if (user.is_phone_verified) {
      return {
        message: 'Phone number is already verified.',
      };
    }

    const verification = await UserPhoneVerificationRepository.findLatestPendingByUserId(user.id);

    if (!verification) {
      throw new AppError('Invalid or expired verification code.', 400);
    }

    const now = new Date();

    if (verification.expires_at <= now) {
      throw new AppError('Invalid or expired verification code.', 400);
    }

    if (verification.attempts >= authConfig.phoneVerification.maxAttempts) {
      throw new AppError('Verification code attempt limit exceeded.', 429);
    }

    const codeMatches = comparePhoneVerificationCode(code, verification.code_hash);

    if (!codeMatches) {
      const nextAttempt = verification.attempts + 1;

      await UserPhoneVerificationRepository.incrementAttempts(verification.id);

      if (nextAttempt >= authConfig.phoneVerification.maxAttempts) {
        throw new AppError('Verification code attempt limit exceeded.', 429);
      }

      throw new AppError('Invalid verification code.', 400);
    }

    await database.transaction(async (transaction) => {
      const consumed = await UserPhoneVerificationRepository.markAsVerified(verification.id, {
        transaction,
      });

      if (!consumed) {
        throw new AppError('Verification code has already been used.', 400);
      }

      await UserRepository.update(
        user,
        {
          is_phone_verified: true,
        },
        {
          transaction,
        }
      );

      await UserPhoneVerificationRepository.invalidatePendingByUserIdExcept(
        user.id,
        verification.id,
        {
          transaction,
        }
      );
    });

    return {
      message: 'Phone verified successfully.',
    };
  }
}

module.exports = new VerificationService();
