const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const multer = require('multer');

const uploadConfig = require('../../config/upload');
const AppError = require('../errors/AppError');

fs.mkdirSync(uploadConfig.temporaryDirectory, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, uploadConfig.temporaryDirectory);
  },

  filename(request, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();

    callback(null, `${randomUUID()}${extension}`);
  },
});

function fileFilter(request, file, callback) {
  const { allowedMimeTypes } = uploadConfig.avatar;

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new AppError('Only JPEG, PNG and WebP images are allowed.', 400));
  }

  return callback(null, true);
}

module.exports = multer({
  storage,

  limits: {
    fileSize: uploadConfig.avatar.maxFileSize,
    files: 1,
  },

  fileFilter,
});
