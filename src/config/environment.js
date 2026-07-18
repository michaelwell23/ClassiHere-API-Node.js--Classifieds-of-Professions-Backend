function parsePositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',

  port: parsePositiveInteger(process.env.PORT, 3000),

  appUrl: process.env.APP_URL || 'http://localhost:3000',

  accountDeletionGracePeriodDays: parsePositiveInteger(
    process.env.ACCOUNT_DELETION_GRACE_PERIOD_DAYS,
    90
  ),
};
