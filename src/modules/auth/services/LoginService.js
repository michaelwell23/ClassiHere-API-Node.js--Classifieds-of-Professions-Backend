const AppError = require('../../../shared/errors/AppError');
const UserRepository = require('../../users/repositories/UserRepository');

const { compareHash } = require('../../../shared/providers/hash/bcrypt.provider');
const { generateToken } = require('../../../shared/providers/auth/jwt.provider');

const UserResponseDTO = require('../../users/dtos/user-response.dto');

class LoginService {
  async execute({ email, password }) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const passwordMatch = await compareHash(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.is_email_verified) {
      throw new AppError('Email not verified', 403);
    }

    if (!user.is_active) {
      throw new AppError('User account disabled', 403);
    }

    const token = generateToken({ userId: user.id });

    return {
      user: UserResponseDTO.toDTO(user),
      token,
    };
  }
}

module.exports = new LoginService();
