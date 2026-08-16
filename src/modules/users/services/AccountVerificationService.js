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
    const emailToken = generateOpaqueToken();

    await UserVerificationRepository.invalidateAllByUserId(user.id, {
      transaction,
    });

    const emailVerification = await UserVerificationRepository.create(
      {
        user_id: user.id,
        token_hash: hashOpaqueToken(emailToken),
        expires_at: new Date(
          Date.now() + authConfig.emailVerification.expiresInHours * 60 * 60 * 1000
        ),
        used_at: null,
      },
      {
        transaction,
      }
    );

    let phoneVerification = null;
    let phoneCode = null;

    if (user.phone) {
      phoneCode = generatePhoneVerificationCode();

      phoneVerification = await UserPhoneVerificationRepository.create(
        {
          user_id: user.id,
          code_hash: hashPhoneVerificationCode(phoneCode),
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
    }

    return {
      email: {
        token: emailToken,
        verification: emailVerification,
      },
      phone: phoneVerification
        ? {
            code: phoneCode,
            verification: phoneVerification,
          }
        : null,
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
      SendVerificationEmailService.execute({
        user,
        token: verification.email.token,
      }),
    ];

    if (verification.phone) {
      tasks.push(
        phoneProvider.send({
          phone: user.phone,
          code: verification.phone.code,
          expiresAt: verification.phone.verification.expires_at,
        })
      );
    }

    const results = await Promise.allSettled(tasks);

    const emailResult = results[0];

    const phoneResult = verification.phone ? results[1] : null;

    if (emailResult.status === 'rejected') {
      console.error({
        event: 'email_verification_delivery_failed',
        userId: user.id,
        error: {
          name: emailResult.reason?.name,
          message: emailResult.reason?.message,
        },
      });
    }

    if (phoneResult && phoneResult.status === 'rejected') {
      console.error({
        event: 'phone_verification_delivery_failed',
        userId: user.id,
        error: {
          name: phoneResult.reason?.name,
          message: phoneResult.reason?.message,
        },
      });
    }

    return {
      emailSent: emailResult.status === 'fulfilled',
      phoneSent: !phoneResult || phoneResult.status === 'fulfilled',
    };
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
