const environment = require('../../../config/environment');

const AccountLifecycleService = require('../services/AccountLifecycleService');

class DeleteInactiveUsersJob {
  async execute() {
    const gracePeriodDays = environment.accountDeletionGracePeriodDays;

    if (!Number.isInteger(gracePeriodDays) || gracePeriodDays <= 0) {
      throw new Error('Invalid account deletion grace period.');
    }

    const limitDate = new Date(Date.now() - gracePeriodDays * 24 * 60 * 60 * 1000);

    const result = await AccountLifecycleService.deleteExpiredAccounts({
      limitDate,
    });

    return {
      processed: result.deleted,
      deleted: result.deleted,
      limit_date: limitDate.toISOString(),
    };
  }
}

module.exports = new DeleteInactiveUsersJob();
