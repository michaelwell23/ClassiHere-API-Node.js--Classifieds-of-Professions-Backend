const path = require('path');
const crypto = require('crypto');

const multer = require('multer');

const AppError = require('../../errors/AppError');

const avatarsDirectory = path.resolve(process.cwd(), 'storage', 'avatars', 'users');

module.exports = multer({
  storage: multer.diskStorage({
    destination(request, file, callback) {
      callback(null, avatarsDirectory);
    },

    filename(request, file, callback) {
      const extension = path.extname(file.originalname).toLowerCase();

      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(request, file, callback) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new AppError('Only JPEG, PNG and WebP images are allowed.', 400));
    }

    return callback(null, true);
  },
});
