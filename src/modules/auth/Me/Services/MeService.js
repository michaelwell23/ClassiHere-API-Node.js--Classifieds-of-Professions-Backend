const UserRepository = require('../../../users/repositories/UserRepository');

class MeService {
  async execute(userId) {
    const user = await UserRepository.findById(userId);

    return { user };
  }
}

module.exports = new MeService();
