const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const AppError = require('../../errors/AppError');

module.exports = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(process.cwd(), 'storage', 'temp'));
    },

    filename(req, file, callback) {
      const extension = path.extname(file.originalname);
      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, callback) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new AppError('Only JPEG, PNG and WebP images are allowed.', 400));
    }

    callback(null, true);
  },
});
