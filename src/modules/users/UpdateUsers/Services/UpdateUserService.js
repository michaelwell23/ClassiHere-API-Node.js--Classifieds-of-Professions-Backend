const AppError = require('../../../../shared/errors/AppError');

const UserRepository = require('../../Repositories/UserRepository');

const imageProcessor = require('../../../../shared/providers/storage/image.processor');
const localStorageProvider = require('../../../../shared/providers/storage/local.provider');

class UpdateUserService {
  async execute({ id, data, file }) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    let newAvatarPath = user.avatar_path;

    try {
      if (file) {
        newAvatarPath = await imageProcessor.process(file.path);
      }

      await user.update({
        ...data,
        avatar_path: file ? newAvatarPath : user.avatar_path,
      });

      if (file && user.avatar_path) {
        await localStorageProvider.delete(user.avatar_path);
      }

      return user;
    } catch (error) {
      if (file && newAvatarPath && newAvatarPath !== user.avatar_path) {
        await localStorageProvider.delete(newAvatarPath);
      }

      throw error;
    }
  }
}

module.exports = new UpdateUserService();
