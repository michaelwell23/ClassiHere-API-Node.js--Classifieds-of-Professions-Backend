const fs = require('fs/promises');
const path = require('path');

const uploadConfig = require('../../../config/upload');

function resolveStoragePath(filePath) {
  if (typeof filePath !== 'string' || !filePath.trim()) {
    throw new TypeError('Storage file path must be a non-empty string.');
  }

  if (path.isAbsolute(filePath)) {
    throw new Error('Absolute storage paths are not allowed.');
  }

  const storageRoot = path.resolve(uploadConfig.storageDirectory);

  const resolvedPath = path.resolve(storageRoot, filePath);

  const isInsideStorage =
    resolvedPath === storageRoot || resolvedPath.startsWith(`${storageRoot}${path.sep}`);

  if (!isInsideStorage) {
    throw new Error('Storage path is outside the configured directory.');
  }

  return resolvedPath;
}

async function deleteFile(filePath) {
  if (!filePath) {
    return false;
  }

  const resolvedPath = resolveStoragePath(filePath);

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
