const { z } = require('zod');

module.exports = z.object({
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

      password: z
        .string({
          required_error: 'New password is required.',
        })
        .min(8, 'Password must contain at least 8 characters.')
        .max(255, 'Password must contain at most 255 characters.'),
    })
    .strict(),
});
