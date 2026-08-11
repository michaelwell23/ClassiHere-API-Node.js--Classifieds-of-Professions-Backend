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
  async prepare({ user, transaction }) {
    const emailToken = generateOpaqueToken();
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

  async dispatch({ user, verification }) {
    const results = await Promise.allSettled([
      SendVerificationEmailService.execute({
        user,
        token: verification.email.token,
      }),

      verification.phone
        ? phoneProvider.send({
            phone: user.phone,
            code: verification.phone.code,
            expiresAt: verification.phone.verification.expires_at,
          })
        : Promise.resolve(),
    ]);

    const emailResult = results[0];
    const phoneResult = results[1];

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

    if (verification.phone && phoneResult.status === 'rejected') {
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
      phoneSent: !verification.phone || phoneResult.status === 'fulfilled',
    };
  }
}

module.exports = new AccountVerificationService();
