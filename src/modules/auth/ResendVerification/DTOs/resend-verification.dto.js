const { z } = require('zod');

module.exports = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email'),
  }),
});
