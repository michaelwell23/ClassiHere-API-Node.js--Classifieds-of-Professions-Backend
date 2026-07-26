const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');
const UserResponseDTO = require('../../users/user-response.dto');

class MeService {
  async execute({ authenticatedUserId }) {
    const user = await UserRepository.findById(authenticatedUserId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    return {
      user: UserResponseDTO(user),
    };
  }
}

module.exports = new MeService();
