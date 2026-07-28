const { z } = require('zod');

module.exports = z.object({
  params: z
    .object({
      token: z
        .string({
          required_error: 'Verification token is required.',
        })
        .trim()
        .regex(/^[a-f0-9]{64}$/i, 'Invalid verification token.'),
    })
    .strict(),
});
