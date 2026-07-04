const fs = require('fs/promises');
const path = require('path');

class LocalPhoneProvider {
  async send({ phone, code, expiresAt }) {
    const directory = path.resolve(process.cwd(), 'storage', 'phone-verification');

    await fs.mkdir(directory, {
      recursive: true,
    });

    const file = path.join(directory, `${phone}.json`);

    await fs.writeFile(
      file,
      JSON.stringify(
        {
          phone,
          code,
          expires_at: expiresAt,
        },
        null,
        2
      )
    );
  }
}

module.exports = new LocalPhoneProvider();
