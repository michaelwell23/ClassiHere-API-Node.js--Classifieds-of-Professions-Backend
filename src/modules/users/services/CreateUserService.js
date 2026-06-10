const SendVerificationEmailService = require('../../auth/services/SendVerificationEmailService');

const UserRepository = require('../repositories/UserRepository');
const UserVerificationRepository = require('../repositories/UserVerificationRepository');

const emailVerificationConfig = require('../../../config/email-verification');

const AppError = require('../../../shared/errors/AppError');
const { generateHash } = require('../../../shared/providers/hash/bcrypt.provider');
const generateVerificationToken = require('../../../shared/utils/generate-verification-token');

class CreateUserService {
  async execute(data) {
    const existingEmail = await UserRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new AppError('Email already exists', 409);
    }

    if (data.cpf) {
      const existingCpf = await UserRepository.findByCpf(data.cpf);

      if (existingCpf) {
        throw new AppError('CPF already exists', 409);
      }
    }

    const hashedPassword = await generateHash(data.password);

    const userData = {
      ...data,
      password: hashedPassword,
      is_email_verified: false,
      is_active: true,
    };

    const user = await UserRepository.create(userData);
    const token = generateVerificationToken();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + emailVerificationConfig.expiresInHours);

    await UserVerificationRepository.create({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    try {
      await SendVerificationEmailService.execute({
        user,
        token,
      });
    } catch (error) {
      console.error('Email send failed', error);
    }

    return user;
  }
}

module.exports = new CreateUserService();
