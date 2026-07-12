const UserRepository = require('../../../users/Repositories/UserRepository');

class MeService {
  async execute(userId) {
    const user = await UserRepository.findById(userId);

    return { user };
  }
}

module.exports = new MeService();
