const path = require('path');

const storageDirectory = path.resolve(process.cwd(), 'storage');
const temporaryAvatarDirectory = path.resolve(storageDirectory, 'tmp', 'avatars');
const userAvatarDirectory = path.resolve(storageDirectory, 'avatars', 'users');

module.exports = {
  storageDirectory,

  avatars: {
    temporaryDirectory: temporaryAvatarDirectory,
    destinationDirectory: userAvatarDirectory,
    relativeDirectory: 'avatars/users',
    maximumFileSize: 5 * 1024 * 1024,
    width: 400,
    height: 400,
    quality: 85,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};
