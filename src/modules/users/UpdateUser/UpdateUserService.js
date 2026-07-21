const AppError = require('../../../shared/errors/AppError');

const imageProcessor = require('../../../shared/providers/storage/image.processor');

const localStorageProvider = require('../../../shared/providers/storage/local.provider');

const UserRepository = require('../repositories/UserRepository');

class UpdateUserService {
  async execute({ id, authenticatedUserId, data, file }) {
    if (id !== authenticatedUserId) {
      throw new AppError('You are not allowed to update this user', 403);
    }

    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.phone !== undefined && data.phone !== user.phone) {
      const existingPhone = await UserRepository.findByPhone(data.phone);

      if (existingPhone && existingPhone.id !== user.id) {
        throw new AppError('Phone already registered', 409);
      }
    }

    const previousAvatarPath = user.avatar_path;
    let newAvatarPath = null;

    try {
      if (file) {
        newAvatarPath = await imageProcessor.process(file.path);
      }

      const updateData = {};

      if (data.first_name !== undefined) {
        updateData.first_name = data.first_name;
      }

      if (data.last_name !== undefined) {
        updateData.last_name = data.last_name;
      }

      if (data.phone !== undefined) {
        updateData.phone = data.phone;
      }

      if (newAvatarPath) {
        updateData.avatar_path = newAvatarPath;
      }

      await UserRepository.update(user, updateData);
    } catch (error) {
      const fileToDelete = newAvatarPath || file?.path;

      if (fileToDelete) {
        try {
          await localStorageProvider.delete(fileToDelete);
        } catch (cleanupError) {
          error.cleanupError = cleanupError;
        }
      }

      throw error;
    }

    if (newAvatarPath && previousAvatarPath && previousAvatarPath !== newAvatarPath) {
      try {
        await localStorageProvider.delete(previousAvatarPath);
      } catch (cleanupError) {
        console.error('Failed to delete previous user avatar:', cleanupError);
      }
    }

    return user;
  }
}

module.exports = new UpdateUserService();
