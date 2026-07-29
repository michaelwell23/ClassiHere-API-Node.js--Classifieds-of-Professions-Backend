const UserRepository = require('../../../modules/users/repositories/UserRepository');

const environment = require('../../../config/environment');

class DeleteInactiveUsersJob {
  async execute() {
    const gracePeriodDays = environment.accountDeletionGracePeriodDays;

    const limitDate = new Date(Date.now() - gracePeriodDays * 24 * 60 * 60 * 1000);

    const deleted = await UserRepository.softDeleteUsersPendingDeletion(limitDate);

    return {
      processed: deleted,
      deleted,
    };
  }
}

module.exports = new DeleteInactiveUsersJob();
