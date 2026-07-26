const fs = require('fs/promises');
const path = require('path');

const sharp = require('sharp');

const uploadConfig = require('../../../config/upload');

class AvatarProcessor {
  async process(filePath) {
    if (!filePath) {
      return null;
    }

    await fs.mkdir(uploadConfig.avatarsDirectory, {
      recursive: true,
    });

    const filename = `${path.parse(filePath).name}.webp`;
    const destination = path.resolve(uploadConfig.avatarsDirectory, filename);

    try {
      await sharp(filePath)
        .rotate()
        .resize(uploadConfig.avatar.width, uploadConfig.avatar.height, {
          fit: 'cover',
          position: 'centre',
        })
        .webp({
          quality: uploadConfig.avatar.quality,
        })
        .toFile(destination);

      await fs.unlink(filePath);

      return `avatars/users/${filename}`;
    } catch (error) {
      await Promise.allSettled([fs.unlink(filePath), fs.unlink(destination)]);

      throw error;
    }
  }
}

module.exports = new AvatarProcessor();
