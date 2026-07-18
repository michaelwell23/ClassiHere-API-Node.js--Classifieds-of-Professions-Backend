require('dotenv').config();

const app = require('./app');
const environment = require('./config/environment');
const database = require('./database/database');

const PORT = environment.PORT || 3000;

async function bootstrap() {
  try {
    await database.authenticate();

    console.log('✓ Database connected');

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('✗ Database connection failed');
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
