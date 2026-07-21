const fs = require('fs/promises');
const path = require('path');

const sharp = require('sharp');

class ImageProcessor {
  async process(filePath) {
    const filename = `${path.parse(filePath).name}.webp`;

    const destination = path.resolve(process.cwd(), 'storage', 'avatars', 'users', filename);

    try {
      await sharp(filePath)
        .resize(400, 400, {
          fit: 'cover',
        })
        .webp({
          quality: 85,
        })
        .toFile(destination);

      await fs.unlink(filePath);

      return `avatars/users/${filename}`;
    } catch (error) {
      try {
        await fs.unlink(destination);
      } catch (cleanupError) {
        if (cleanupError.code !== 'ENOENT') {
          error.cleanupError = cleanupError;
        }
      }

      throw error;
    }
  }
}

module.exports = new ImageProcessor();
