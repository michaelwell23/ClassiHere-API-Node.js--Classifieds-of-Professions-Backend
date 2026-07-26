const path = require('path');
const env = require('./env');

const storageDirectory = path.resolve(process.cwd(), 'storage');
const temporaryDirectory = path.resolve(storageDirectory, 'tmp');
const avatarsDirectory = path.resolve(storageDirectory, 'avatars', 'users');

module.exports = {
  storageDirectory,
  temporaryDirectory,
  avatarsDirectory,
  avatar: {
    maxFileSize: env.getPositiveInteger('AVATAR_MAX_FILE_SIZE_BYTES', 5 * 1024 * 1024),
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    width: env.getPositiveInteger('AVATAR_WIDTH', 400),
    height: env.getPositiveInteger('AVATAR_HEIGHT', 400),
    quality: env.getPositiveInteger('AVATAR_WEBP_QUALITY', 85),
  },
};
