const fs = require('fs/promises');
const path = require('path');

const sharp = require('sharp');

const uploadConfig = require('../../../config/upload');

class AvatarProcessor {
  async process(filePath) {
    if (typeof filePath !== 'string' || !filePath) {
      throw new TypeError('Avatar file path is required.');
    }

    const { destinationDirectory, relativeDirectory, width, height, quality } =
      uploadConfig.avatars;

    if (!destinationDirectory) {
      throw new Error('Avatar destination directory is not configured.');
    }

    await fs.mkdir(destinationDirectory, {
      recursive: true,
    });

    const filename = `${path.parse(filePath).name}.webp`;
    const destinationPath = path.resolve(destinationDirectory, filename);

    try {
      await sharp(filePath)
        .rotate()
        .resize(width, height, {
          fit: 'cover',
          position: 'centre',
        })
        .webp({
          quality,
        })
        .toFile(destinationPath);

      await fs.unlink(filePath);

      return path.posix.join(relativeDirectory, filename);
    } catch (error) {
      try {
        await fs.unlink(destinationPath);
      } catch (cleanupError) {
        if (cleanupError.code !== 'ENOENT') {
          error.cleanupError = cleanupError;
        }
      }

      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        if (cleanupError.code !== 'ENOENT') {
          if (!error.cleanupErrors) {
            error.cleanupErrors = [];
          }

          error.cleanupErrors.push(cleanupError);
        }
      }

      throw error;
    }
  }
}

module.exports = new AvatarProcessor();
