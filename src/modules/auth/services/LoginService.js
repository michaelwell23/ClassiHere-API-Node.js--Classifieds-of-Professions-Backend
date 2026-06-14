const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');
const UserRefreshTokenRepository = require('../../sessions/repositories/UserRefreshTokenRepository');

const { generateHash, compareHash } = require('../../../shared/providers/hash/bcrypt.provider');

const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../../shared/providers/auth/jwt.provider');

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

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 30);

    const refreshTokenHash = await generateHash(refreshToken);

    await UserRefreshTokenRepository.create({
      user_id: user.id,
      token: refreshTokenHash,
      expires_at: expiresAt,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: UserResponseDTO(user),
    };
  }
}

module.exports = new LoginService();
