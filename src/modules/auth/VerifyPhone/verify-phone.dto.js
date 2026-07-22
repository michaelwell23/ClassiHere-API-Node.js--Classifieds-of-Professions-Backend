const { z } = require('zod');

module.exports = z.object({
  body: z.object({
    code: z
      .string({
        required_error: 'Verification code is required',
      })
      .length(6),
  }),
});
