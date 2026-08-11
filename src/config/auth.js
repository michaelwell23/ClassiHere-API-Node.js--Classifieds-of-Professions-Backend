function parsePositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
const phoneVerificationCodeSecret = process.env.PHONE_VERIFICATION_CODE_SECRET;

if (!accessTokenSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!refreshTokenSecret) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required');
}

if (!phoneVerificationCodeSecret) {
  throw new Error('PHONE_VERIFICATION_CODE_SECRET environment variable is required');
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

  password: {
    saltRounds: parsePositiveInteger(process.env.PASSWORD_SALT_ROUNDS, 10),
  },

  emailVerification: {
    expiresInHours: parsePositiveInteger(process.env.EMAIL_VERIFICATION_EXPIRES_IN_HOURS, 24),
  },

  phoneVerification: {
    expiresInMinutes: parsePositiveInteger(process.env.PHONE_VERIFICATION_EXPIRES_IN_MINUTES, 60),
    maxAttempts: parsePositiveInteger(process.env.PHONE_VERIFICATION_MAX_ATTEMPTS, 5),
    resendIntervalSeconds: parsePositiveInteger(
      process.env.PHONE_VERIFICATION_RESEND_INTERVAL_SECONDS,
      60
    ),

    codeSecret: phoneVerificationCodeSecret,
  },

  passwordReset: {
    expiresInMinutes: parsePositiveInteger(process.env.PASSWORD_RESET_EXPIRES_IN_MINUTES, 30),
  },

  loginSecurity: {
    maxAttempts: parsePositiveInteger(process.env.MAX_LOGIN_ATTEMPTS, 5),

    lockDurationMinutes: parsePositiveInteger(process.env.ACCOUNT_LOCK_DURATION_MINUTES, 30),
  },
};
