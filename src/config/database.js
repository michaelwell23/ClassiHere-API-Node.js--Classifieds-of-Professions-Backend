const env = require('./env');
const environment = require('./environment');

const commonConfig = {
  dialect: 'postgres',

  host: env.getRequiredString('DB_HOST'),
  port: env.getPositiveInteger('DB_PORT', 5432),

  username: env.getRequiredString('DB_USER'),
  password: env.getRequiredString('DB_PASSWORD'),
  database: env.getRequiredString('DB_NAME'),

  logging: environment.isDevelopment ? console.log : false,

  define: {
    underscored: true,
    freezeTableName: true,
  },

  pool: {
    max: env.getPositiveInteger('DB_POOL_MAX', 10),
    min: 0,
    acquire: env.getPositiveInteger('DB_POOL_ACQUIRE_MS', 30000),
    idle: env.getPositiveInteger('DB_POOL_IDLE_MS', 10000),
  },
};

module.exports = {
  development: {
    ...commonConfig,
  },

  test: {
    ...commonConfig,
    logging: false,
  },

  production: {
    ...commonConfig,
    logging: false,
  },
};
