const AppError = require('../../../../shared/errors/AppError');

const UserRepository = require('../../Repositories/UserRepository');

const imageProcessor = require('../../../../shared/providers/storage/image.processor');
const localStorageProvider = require('../../../../shared/providers/storage/local.provider');

class CreateUserService {
  async execute({ data, file }) {
    let avatarPath = null;

    try {
      const existingEmail = await UserRepository.findByEmail(data.email);

      if (existingEmail) {
        throw new AppError('E-mail already registered', 409);
      }

      if (data.cpf) {
        const existingCpf = await UserRepository.findByCpf(data.cpf);

        if (existingCpf) {
          throw new AppError('CPF already registered', 409);
        }
      }

      if (file) {
        avatarPath = await imageProcessor.process(file.path);
      }

      const user = await UserRepository.create({
        ...data,
        avatar_path: avatarPath,
        is_email_verified: false,
        is_active: true,
      });

      return user;
    } catch (error) {
      if (avatarPath) {
        await localStorageProvider.delete(avatarPath);
      }

      throw error;
    }
  }
}

module.exports = new CreateUserService();
