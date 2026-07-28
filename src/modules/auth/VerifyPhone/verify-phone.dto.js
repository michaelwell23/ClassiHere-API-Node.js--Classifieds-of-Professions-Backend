const { z } = require('zod');

module.exports = z.object({
  body: z
    .object({
      code: z
        .string({
          required_error: 'Verification code is required.',
        })
        .trim()
        .regex(/^\d{6}$/, 'Verification code must contain exactly 6 digits.'),
    })
    .strict(),
});
