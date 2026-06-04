const database = require('./index');

async function testConnection() {
  try {
    await database.authenticate();

    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database.');

    console.error(error);
  } finally {
    await database.close();
  }
}

testConnection();
