const { z } = require('zod');

const emailSchema = z
  .string({
    required_error: 'Email is required.',
  })
  .trim()
  .email('Invalid email format.')
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string({
    required_error: 'Password is required.',
  })
  .min(1, 'Password is required.');

const refreshTokenSchema = z
  .string({
    required_error: 'Refresh token is required.',
  })
  .min(1, 'Refresh token is required.');

const loginDTO = z
  .object({
    body: z
      .object({
        email: emailSchema,
        password: passwordSchema,
      })
      .strict(),
  })
  .strict();

const reactivateAccountDTO = z
  .object({
    body: z
      .object({
        email: emailSchema,
        password: passwordSchema,
      })
      .strict(),
  })
  .strict();

const logoutDTO = z
  .object({
    body: z
      .object({
        refresh_token: refreshTokenSchema,
      })
      .strict(),
  })
  .strict();

const refreshTokenDTO = z
  .object({
    body: z
      .object({
        refresh_token: refreshTokenSchema,
      })
      .strict(),
  })
  .strict();

module.exports = {
  loginDTO,
  reactivateAccountDTO,
  logoutDTO,
  refreshTokenDTO,
};
