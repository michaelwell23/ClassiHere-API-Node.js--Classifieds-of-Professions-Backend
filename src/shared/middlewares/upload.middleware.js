const multer = require('multer');

const multerConfig = require('../providers/storage/multer.config');

module.exports = multer(multerConfig);
