const AppError = require('../../../shared/errors/AppError');

const { UserRepository } = require('../repositories/UserRepository');

class UpdateUserService {
  async execute(id, data) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
      const existingEmail = await UserRepository.findByEmail(data.email);

      if (existingEmail) {
        throw new AppError('E-mail already registered', 409);
      }
    }

    if (data.cpf && data.cpf !== user.cpf) {
      const existingCpf = await UserRepository.findByCpf(data.cpf);

      if (existingCpf) {
        throw new AppError('CPF already registered', 409);
      }
    }

    await UserRepository.update(user, data);

    return user;
  }
}

module.exports = new UpdateUserService();
