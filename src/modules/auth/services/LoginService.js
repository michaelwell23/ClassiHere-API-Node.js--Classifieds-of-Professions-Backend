const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');
const UserRefreshTokenRepository = require('../../sessions/repositories/UserRefreshTokenRepository');

const { generateHash, compareHash } = require('../../../shared/providers/hash/bcrypt.provider');
const { generateJti } = require('../../../shared/providers/auth/jwt.provider');

const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../../shared/providers/auth/jwt.provider');

const UserResponseDTO = require('../../users/dtos/user-response.dto');

class LoginService {
  async execute({ email, password }) {
    const expiresAt = new Date();
    const jti = generateJti();

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

    const refreshToken = generateRefreshToken({
      sub: user.id,
      jti,
    });

    const refreshTokenHash = await generateHash(refreshToken);

    expiresAt.setDate(expiresAt.getDate() + 30);

    await UserRefreshTokenRepository.create({
      user_id: user.id,
      jti,
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
