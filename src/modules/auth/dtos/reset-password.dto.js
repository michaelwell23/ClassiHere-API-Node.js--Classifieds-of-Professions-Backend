const { z } = require('zod');

module.exports = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
    token: z.string().min(1),
    password: z.string().min(8).max(255),
  }),
});
