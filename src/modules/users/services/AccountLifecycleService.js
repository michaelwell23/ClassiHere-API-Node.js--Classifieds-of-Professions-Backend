const database = require('../../../database');

const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../repositories/UserRepository');

const UserRefreshTokenRepository = require('../../auth/repositories/UserRefreshTokenRepository');

class AccountLifecycleService {
  async deactivate({ authenticatedUserId, userId }) {
    if (authenticatedUserId !== userId) {
      throw new AppError('You are not allowed to deactivate this account.', 403);
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!user.is_active) {
      throw new AppError('User account is already deactivated.', 409);
    }

    await database.transaction(async (transaction) => {
      await UserRepository.update(
        user,
        {
          is_active: false,
          deactivated_at: new Date(),
        },
        {
          transaction,
        }
      );

      await UserRefreshTokenRepository.deleteAllByUserId(user.id, {
        transaction,
      });
    });

    return {
      message: 'User account deactivated successfully.',
    };
  }

  async reactivate({ authenticatedUserId, userId }) {
    if (authenticatedUserId !== userId) {
      throw new AppError('You are not allowed to reactivate this account.', 403);
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (user.is_active) {
      throw new AppError('User account is already active.', 409);
    }

    await UserRepository.update(user, {
      is_active: true,
      deactivated_at: null,
      deletion_requested_at: null,
      failed_login_attempts: 0,
      locked_until: null,
    });

    return {
      message: 'User account reactivated successfully.',
    };
  }

  async requestDeletion({ authenticatedUserId, userId }) {
    if (authenticatedUserId !== userId) {
      throw new AppError('You are not allowed to request deletion of this account.', 403);
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (user.deletion_requested_at) {
      throw new AppError('Account deletion has already been requested.', 409);
    }

    const now = new Date();

    await database.transaction(async (transaction) => {
      await UserRepository.update(
        user,
        {
          is_active: false,

          deactivated_at: user.deactivated_at || now,

          deletion_requested_at: now,
        },
        {
          transaction,
        }
      );

      await UserRefreshTokenRepository.deleteAllByUserId(user.id, {
        transaction,
      });
    });

    return {
      message: 'Account deletion requested successfully.',
    };
  }

  async cancelDeletion({ authenticatedUserId, userId }) {
    if (authenticatedUserId !== userId) {
      throw new AppError('You are not allowed to cancel deletion of this account.', 403);
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!user.deletion_requested_at) {
      throw new AppError('Account deletion has not been requested.', 409);
    }

    await UserRepository.update(user, {
      deletion_requested_at: null,
      is_active: true,
      deactivated_at: null,
      failed_login_attempts: 0,
      locked_until: null,
    });

    return {
      message: 'Account deletion request cancelled successfully.',
    };
  }

  async deleteExpiredAccounts({ limitDate }) {
    if (!(limitDate instanceof Date) || Number.isNaN(limitDate.getTime())) {
      throw new TypeError('Deletion limit date must be a valid Date.');
    }

    const deleted = await UserRepository.softDeleteUsersPendingDeletion(limitDate);

    return {
      deleted,
    };
  }
}

module.exports = new AccountLifecycleService();
