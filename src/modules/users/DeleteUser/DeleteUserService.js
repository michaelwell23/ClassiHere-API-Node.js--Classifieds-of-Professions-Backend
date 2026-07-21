const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../repositories/UserRepository');

class DeleteUserService {
  async execute({ id, authenticatedUserId }) {
    if (id !== authenticatedUserId) {
      throw new AppError('You are not allowed to delete this user', 403);
    }

    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await UserRepository.softDelete(user);

    return {
      message: 'User deleted successfully',
    };
  }
}

module.exports = new DeleteUserService();
