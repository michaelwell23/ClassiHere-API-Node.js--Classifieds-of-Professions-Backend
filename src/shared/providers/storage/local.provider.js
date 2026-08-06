const fs = require('fs/promises');
const path = require('path');

const uploadConfig = require('../../../config/upload');

async function deleteFile(filePath) {
  if (!filePath) {
    return false;
  }

  const resolvedPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(uploadConfig.storageDirectory, filePath);

  const relativePath = path.relative(uploadConfig.storageDirectory, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error('File path is outside the configured storage directory.');
  }

  try {
    await fs.unlink(resolvedPath);

    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}

module.exports = {
  delete: deleteFile,
};
