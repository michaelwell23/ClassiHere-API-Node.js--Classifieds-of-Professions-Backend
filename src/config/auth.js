const env = require('./env');

module.exports = {
  jwt: {
    accessToken: {
      secret: env.getRequiredString('JWT_SECRET'),
      expiresIn: env.getString('JWT_EXPIRES_IN', '1d'),
    },
    refreshToken: {
      secret: env.getRequiredString('JWT_REFRESH_SECRET'),
      expiresIn: env.getString('JWT_REFRESH_EXPIRES_IN', '30d'),
    },
  },

  password: {
    saltRounds: env.getPositiveInteger('BCRYPT_SALT_ROUNDS', 10),
  },

  emailVerification: {
    expiresInHours: env.getPositiveInteger('EMAIL_VERIFICATION_EXPIRES_IN_HOURS', 24),
  },

  loginSecurity: {
    maxAttempts: env.getPositiveInteger('MAX_LOGIN_ATTEMPTS', 5),
    lockDurationMinutes: env.getPositiveInteger('ACCOUNT_LOCK_DURATION_MINUTES', 30),
  },

  passwordReset: {
    expiresInMinutes: env.getPositiveInteger('PASSWORD_RESET_EXPIRES_IN_MINUTES', 60),
  },

  phoneVerification: {
    expiresInMinutes: env.getPositiveInteger('PHONE_VERIFICATION_EXPIRES_IN_MINUTES', 10),
    maxAttempts: env.getPositiveInteger('PHONE_VERIFICATION_MAX_ATTEMPTS', 5),
    resendIntervalSeconds: env.getPositiveInteger('PHONE_VERIFICATION_RESEND_INTERVAL_SECONDS', 60),
    codeSecret: env.getString('PHONE_VERIFICATION_CODE_SECRET'),
  },
};
