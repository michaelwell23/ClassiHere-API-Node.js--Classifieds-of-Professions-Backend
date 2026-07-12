const UserTermAcceptance = require('../../../database/models/UserTermAcceptance');

class UserTermAcceptanceRepository {
  async findByUserAndTerm(userId, termId) {
    return UserTermAcceptance.findOne({
      where: {
        user_id: userId,
        term_id: termId,
      },
    });
  }

  async create(data) {
    return UserTermAcceptance.create(data);
  }
}

module.exports = new UserTermAcceptanceRepository();
