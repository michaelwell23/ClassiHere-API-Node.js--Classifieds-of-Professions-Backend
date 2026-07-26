const app = require('./app');
const database = require('./database');
const environment = require('./config/environment');

async function bootstrap() {
  try {
    await database.authenticate();

    app.listen(environment.port, () => {
      console.log(`Server running on port ${environment.port}`);
    });
  } catch (error) {
    console.error('Unable to start the application.');
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
