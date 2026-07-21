function parsePositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

const accessTokenSecret = process.env.JWT_SECRET;

const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

if (!accessTokenSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!refreshTokenSecret) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required');
}

module.exports = {
  jwt: {
    accessToken: {
      secret: accessTokenSecret,
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },

    refreshToken: {
      secret: refreshTokenSecret,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
  },

  emailVerification: {
    expiresInHours: parsePositiveInteger(process.env.EMAIL_VERIFICATION_EXPIRES_IN_HOURS, 24),
  },

  loginSecurity: {
    maxAttempts: parsePositiveInteger(process.env.MAX_LOGIN_ATTEMPTS, 5),

    lockDurationMinutes: parsePositiveInteger(process.env.ACCOUNT_LOCK_DURATION_MINUTES, 30),
  },
};
