const { z } = require('zod');

const passwordSchema = z
  .string({
    required_error: 'Password is required.',
  })
  .min(8, 'Password must contain at least 8 characters.')
  .max(255, 'Password must contain at most 255 characters.');

const changePasswordDTO = z.object({
  body: z
    .object({
      currentPassword: z
        .string({
          required_error: 'Current password is required.',
        })
        .min(1, 'Current password is required.'),

      newPassword: passwordSchema,
    })
    .strict(),
});

const forgotPasswordDTO = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: 'Email is required.',
        })
        .trim()
        .email('Invalid email format.')
        .transform((value) => value.toLowerCase()),
    })
    .strict(),
});

const resetPasswordDTO = z.object({
  body: z
    .object({
      resetId: z
        .string({
          required_error: 'Reset identifier is required.',
        })
        .uuid('Invalid reset identifier.'),

      token: z
        .string({
          required_error: 'Reset token is required.',
        })
        .trim()
        .min(1, 'Reset token is required.'),

      password: passwordSchema,
    })
    .strict(),
});

module.exports = {
  changePasswordDTO,
  forgotPasswordDTO,
  resetPasswordDTO,
};
