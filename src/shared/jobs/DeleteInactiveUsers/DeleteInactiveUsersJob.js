const UserRepository = require('../../../modules/users/repositories/UserRepository');
const { ACCOUNT_DELETION_GRACE_PERIOD_DAYS } = require('../../../config/account');

class DeleteInactiveUsersJob {
  async execute() {
    const limitDate = new Date();

    limitDate.setDate(limitDate.getDate() - ACCOUNT_DELETION_GRACE_PERIOD_DAYS);

    const users = await UserRepository.findUsersPendingDeletion(limitDate);

    let deleted = 0;

    for (const user of users) {
      await UserRepository.delete(user);
      deleted++;
    }

    return {
      processed: users.length,
      deleted,
    };
  }
}

module.exports = new DeleteInactiveUsersJob();
