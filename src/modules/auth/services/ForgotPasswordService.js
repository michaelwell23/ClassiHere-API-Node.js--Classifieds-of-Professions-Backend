const { randomBytes } = require('crypto');

const UserRepository = require('../../users/repositories/UserRepository');

const PasswordResetTokenRepository = require('../../password-reset/repositories/PasswordResetTokenRepository');

const { generateHash } = require('../../../shared/providers/hash/bcrypt.provider');

const MailProvider = require('../../../shared/providers/mail/MailProvider');

const passwordResetTemplate = require('../../../shared/mail/templates/password-reset.template');

class ForgotPasswordService {
  async execute(email) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      return {
        message: 'If the email exists, password recovery instructions have been sent.',
      };
    }

    await PasswordResetTokenRepository.invalidateAllByUser(user.id);

    const token = randomBytes(32).toString('hex');

    const tokenHash = await generateHash(token);

    const expiresAt = new Date();

    expiresAt.setHours(expiresAt.getHours() + 1);

    await PasswordResetTokenRepository.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await MailProvider.sendMail({
      to: user.email,
      subject: 'Recuperação de Senha',
      html: passwordResetTemplate({
        userName: user.name,
        resetLink,
      }),
    });

    return {
      message: 'If the email exists, password recovery instructions have been sent.',
    };
  }
}

module.exports = new ForgotPasswordService();
