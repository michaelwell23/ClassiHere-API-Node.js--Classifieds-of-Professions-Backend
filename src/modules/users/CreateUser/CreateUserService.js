const AppError = require('../../../shared/errors/AppError');

const bcryptProvider = require('../../../shared/providers/hash/bcrypt.provider');

const imageProcessor = require('../../../shared/providers/storage/image.processor');

const localStorageProvider = require('../../../shared/providers/storage/local.provider');

const UserRepository = require('../repositories/UserRepository');

class CreateUserService {
  async execute({ data, file }) {
    let avatarPath = null;

    try {
      const existingEmail = await UserRepository.findByEmail(data.email);

      if (existingEmail) {
        throw new AppError('E-mail already registered', 409);
      }

      const existingCpf = await UserRepository.findByCpf(data.cpf);

      if (existingCpf) {
        throw new AppError('CPF already registered', 409);
      }

      if (data.phone) {
        const existingPhone = await UserRepository.findByPhone(data.phone);

        if (existingPhone) {
          throw new AppError('Phone already registered', 409);
        }
      }

      const hashedPassword = await bcryptProvider.generateHash(data.password);

      if (file) {
        avatarPath = await imageProcessor.process(file.path);
      }

      return await UserRepository.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone ?? null,
        cpf: data.cpf,
        avatar_path: avatarPath,
        is_email_verified: false,
        is_phone_verified: false,
        is_active: true,
      });
    } catch (error) {
      try {
        if (avatarPath) {
          await localStorageProvider.delete(avatarPath);
        } else if (file?.path) {
          await localStorageProvider.delete(file.path);
        }
      } catch {
        // Preserva o erro original do caso de uso.
      }

      throw error;
    }
  }
}

module.exports = new CreateUserService();
