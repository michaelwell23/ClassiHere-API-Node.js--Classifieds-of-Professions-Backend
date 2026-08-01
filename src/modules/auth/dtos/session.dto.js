const { z } = require('zod');

const refreshTokenBodySchema = z
  .object({
    refresh_token: z
      .string({
        required_error: 'Refresh token is required.',
      })
      .trim()
      .min(1, 'Refresh token is required.'),
  })
  .strict();

const loginDTO = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: 'Email is required.',
        })
        .trim()
        .email('Invalid email format.')
        .transform((value) => value.toLowerCase()),

      password: z
        .string({
          required_error: 'Password is required.',
        })
        .min(1, 'Password is required.'),
    })
    .strict(),
});

const logoutDTO = z.object({
  body: refreshTokenBodySchema,
});

const refreshTokenDTO = z.object({
  body: refreshTokenBodySchema,
});

module.exports = {
  loginDTO,
  logoutDTO,
  refreshTokenDTO,
};
