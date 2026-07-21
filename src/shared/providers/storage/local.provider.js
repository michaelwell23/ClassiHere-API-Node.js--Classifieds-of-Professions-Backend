const path = require('path');
const fs = require('fs/promises');

class LocalStorageProvider {
  async delete(filePath) {
    if (!filePath) {
      return;
    }

    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), 'storage', filePath);

    try {
      await fs.unlink(resolvedPath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

module.exports = new LocalStorageProvider();
