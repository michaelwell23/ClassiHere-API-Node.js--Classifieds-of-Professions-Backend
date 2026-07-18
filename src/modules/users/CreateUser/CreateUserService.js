const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../repositories/UserRepository');

const bcryptProvider = require('../../../shared/providers/hash/bcrypt.provider');

const imageProcessor = require('../../../shared/providers/storage/image.processor');

const localStorageProvider = require('../../../shared/providers/storage/local.provider');

const UserResponseDTO = require('../../../shared/DTOs/responses/user-response.dto');

class CreateUserService {
  async execute({ data, file }) {
    let avatarPath = null;

    try {
      const email = data.email.trim().toLowerCase();
      const cpf = data.cpf ? data.cpf.replace(/\D/g, '') : null;
      const phone = data.phone ? data.phone.replace(/\D/g, '') : null;

      const existingEmail = await UserRepository.findByEmail(email);

      if (existingEmail) {
        throw new AppError('E-mail already registered', 409);
      }

      if (cpf) {
        const existingCpf = await UserRepository.findByCpf(cpf);

        if (existingCpf) {
          throw new AppError('CPF already registered', 409);
        }
      }

      if (phone) {
        const existingPhone = await UserRepository.findByPhone(phone);

        if (existingPhone) {
          throw new AppError('Phone already registered', 409);
        }
      }

      const hashedPassword = await bcryptProvider.hash(data.password);

      if (file) {
        avatarPath = await imageProcessor.process(file.path);
      }

      const user = await UserRepository.create({
        ...data,
        email,
        cpf,
        phone,
        password: hashedPassword,
        avatar_path: avatarPath,
        is_email_verified: false,
        is_phone_verified: false,
        is_active: true,
      });

      return UserResponseDTO.toResponse(user);
    } catch (error) {
      if (avatarPath) {
        try {
          await localStorageProvider.delete(avatarPath);
        } catch {
          // O erro original da criação deve ser preservado.
        }
      } else if (file?.path) {
        try {
          await localStorageProvider.delete(file.path);
        } catch {
          // O erro original do processamento deve ser preservado.
        }
      }

      throw error;
    }
  }
}

module.exports = new CreateUserService();
