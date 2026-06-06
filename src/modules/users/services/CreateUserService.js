const AppError = require('../../../shared/errors/AppError');

const { UserRepository } = require('../repositories/UserRepository');

class CrreateUserService {
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

    const user = await UserRepository.create({
      ...data,
      is_email_verified: false,
      is_active: true,
    });

    return user;
  }
}

module.exports = new CrreateUserService();
