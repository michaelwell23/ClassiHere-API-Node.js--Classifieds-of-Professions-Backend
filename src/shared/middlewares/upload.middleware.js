const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const multer = require('multer');

const uploadConfig = require('../../config/upload');

const AppError = require('../errors/AppError');

fs.mkdirSync(uploadConfig.avatars.temporaryDirectory, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination(request, file, callback) {
    return callback(null, uploadConfig.avatars.temporaryDirectory);
  },

  filename(request, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    return callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

function fileFilter(request, file, callback) {
  if (!uploadConfig.avatars.allowedMimeTypes.includes(file.mimetype)) {
    return callback(new AppError('Only JPEG, PNG and WebP images are allowed.', 400));
  }

  return callback(null, true);
}

module.exports = multer({
  storage,

  limits: {
    fileSize: uploadConfig.avatars.maximumFileSize,

    files: 1,
  },

  fileFilter,
});
