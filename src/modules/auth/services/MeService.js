const UserRepository = require('../../users/repositories/UserRepository');

const UserResponseDTO = require('../../users/dtos/user-response.dto');

class MeService {
  async execute(userId) {
    const user = await UserRepository.findById(userId);

    return { user: UserResponseDTO(user) };
  }
}

module.exports = new MeService();
