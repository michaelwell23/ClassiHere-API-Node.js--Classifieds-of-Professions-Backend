const env = require('./env');

const nodeEnv = env.getString('NODE_ENV', 'development');

module.exports = {
  nodeEnv,

  isDevelopment: nodeEnv === 'development',
  isTest: nodeEnv === 'test',
  isProduction: nodeEnv === 'production',

  port: env.getPositiveInteger('PORT', 3000),
  appUrl: env.getString('APP_URL', 'http://localhost:3000'),

  accountDeletionGracePeriodDays: env.getPositiveInteger('ACCOUNT_DELETION_GRACE_PERIOD_DAYS', 90),
};
