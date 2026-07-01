const path = require('path');
const fs = require('fs/promises');

class LocalStorageProvider {
  async delete(avatarPath) {
    if (!avatarPath) {
      return;
    }

    const filePath = path.resolve(process.cwd(), 'storage', avatarPath);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch {
      // arquivo já não existe
    }
  }
}

module.exports = new LocalStorageProvider();
