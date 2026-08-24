const authConfig = require('../../../config/auth');

const UserVerificationRepository = require('../../auth/repositories/UserVerificationRepository');

const UserPhoneVerificationRepository = require('../../auth/repositories/UserPhoneVerificationRepository');

const SendVerificationEmailService = require('../../auth/mail/SendVerificationEmailService');

const phoneProvider = require('../../../shared/providers/phone/local.provider');

const {
  generateOpaqueToken,
  hashOpaqueToken,
} = require('../../auth/providers/opaque-token.provider');

const {
  generatePhoneVerificationCode,
  hashPhoneVerificationCode,
} = require('../../auth/providers/phone-verification-code.provider');

class AccountVerificationService {
  async prepareInitialVerification({ user, transaction }) {
    const email = await this.prepareEmailVerification({
      user,
      transaction,
    });

    const phone = user.phone
      ? await this.preparePhoneVerification({
          user,
          transaction,
        })
      : null;

    return {
      email,
      phone,
    };
  }

  async prepareEmailVerification({ user, transaction }) {
    const token = generateOpaqueToken();

    await UserVerificationRepository.invalidateAllByUserId(user.id, {
      transaction,
    });

    const verification = await UserVerificationRepository.create(
      {
        user_id: user.id,
        token_hash: hashOpaqueToken(token),
        expires_at: new Date(
          Date.now() + authConfig.emailVerification.expiresInHours * 60 * 60 * 1000
        ),

        used_at: null,
      },
      {
        transaction,
      }
    );

    return {
      token,
      verification,
    };
  }

  async preparePhoneVerification({ user, transaction }) {
    if (!user.phone) {
      return null;
    }

    const code = generatePhoneVerificationCode();

    const verification = await UserPhoneVerificationRepository.create(
      {
        user_id: user.id,
        code_hash: hashPhoneVerificationCode(code),
        expires_at: new Date(
          Date.now() + authConfig.phoneVerification.expiresInMinutes * 60 * 1000
        ),

        attempts: 0,
        verified_at: null,
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

    return {
      code,
      verification,
    };
  }

  async dispatchInitialVerification({ user, verification }) {
    const tasks = [
      this.dispatchEmailVerification({
        user,
        verification: verification.email,
      }),
    ];

    if (verification.phone) {
      tasks.push(
        this.dispatchPhoneVerification({
          user,
          verification: verification.phone,
        })
      );
    }

    await Promise.allSettled(tasks);
  }

  async dispatchEmailVerification({ user, verification }) {
    try {
      await SendVerificationEmailService.execute({
        user,
        token: verification.token,
      });

      return {
        emailSent: true,
      };
    } catch (error) {
      console.error({
        event: 'email_verification_delivery_failed',
        userId: user.id,
        error: {
          name: error.name,
          message: error.message,
        },
      });

      return {
        emailSent: false,
      };
    }
  }

  async dispatchPhoneVerification({ user, verification }) {
    if (!verification) {
      return {
        phoneSent: false,
      };
    }

    try {
      await phoneProvider.send({
        phone: user.phone,
        code: verification.code,
        expiresAt: verification.verification.expires_at,
      });

      return {
        phoneSent: true,
      };
    } catch (error) {
      console.error({
        event: 'phone_verification_delivery_failed',
        userId: user.id,
        error: {
          name: error.name,
          message: error.message,
        },
      });

      return {
        phoneSent: false,
      };
    }
  }
}

module.exports = new AccountVerificationService();
