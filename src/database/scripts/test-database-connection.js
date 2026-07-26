const database = require('../database');

async function testDatabaseConnection() {
  try {
    await database.authenticate();

    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database.');
    console.error(error);

    process.exitCode = 1;
  } finally {
    await database.close();
  }
}

testDatabaseConnection();
