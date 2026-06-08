const AppError = require('../../../shared/errors/AppError');

const { UserRepository } = require('../repositories/UserRepository');

const { generateHash } = require('../../../shared/providers/hash/bcrypt.provider');

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

    return user;
  }
}

module.exports = CreateUserService;
