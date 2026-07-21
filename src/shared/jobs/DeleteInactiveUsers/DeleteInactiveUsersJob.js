const UserRepository = require('../../../modules/users/repositories/UserRepository');

const environment = require('../../../config/environment');
class DeleteInactiveUsersJob {
  async execute() {
    const limitDate = new Date();

    limitDate.setDate(limitDate.getDate() - environment.accountDeletionGracePeriodDays);

    const users = await UserRepository.findUsersPendingDeletion(limitDate);

    let deleted = 0;

    for (const user of users) {
      await UserRepository.softDelete(user);
      deleted++;
    }

    return {
      processed: users.length,
      deleted,
    };
  }
}

module.exports = new DeleteInactiveUsersJob();
