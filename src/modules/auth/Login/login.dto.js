const { z } = require('zod');

module.exports = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase()),

    password: z.string().min(1),
  }),
});
