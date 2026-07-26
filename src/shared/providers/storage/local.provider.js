const fs = require('fs/promises');
const path = require('path');

const uploadConfig = require('../../../config/upload');

async function deleteFile(filePath) {
  if (!filePath) {
    return;
  }

  const resolvedPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(uploadConfig.storageDirectory, filePath);

  try {
    await fs.unlink(resolvedPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

module.exports = {
  delete: deleteFile,
};
