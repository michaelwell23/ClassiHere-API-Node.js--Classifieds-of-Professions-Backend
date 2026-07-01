const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

class ImageProcessor {
  async process(filePath) {
    const filename = `${path.parse(filePath).name}.webp`;

    const destination = path.resolve(process.cwd(), 'storage', 'avatars', 'users', filename);

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
  }
}

module.exports = new ImageProcessor();
