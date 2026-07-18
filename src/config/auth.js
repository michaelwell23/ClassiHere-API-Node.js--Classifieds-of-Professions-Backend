function parsePositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

module.exports = {
  jwt: {
    accessToken: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },

    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET,
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
