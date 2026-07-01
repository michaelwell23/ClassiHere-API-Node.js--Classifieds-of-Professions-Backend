const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

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
      return callback(new Error('Invalid image format.'));
    }

    callback(null, true);
  },
});
