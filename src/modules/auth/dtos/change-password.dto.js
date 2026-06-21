const { z } = require('zod');

module.exports = z.object({
  body: z.object({
    currentPassword: z
      .string({
        required_error: 'Current password is required',
      })
      .min(1),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(8, 'Password must contain at least 8 characters')
      .max(255, 'Password must contain at most 255 characters'),
  }),
});
