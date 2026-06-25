const { z } = require('zod');

module.exports = z.object({
  body: z.object({
    resetId: z.string().uuid(),
    token: z.string().min(1),
    password: z.string().min(8).max(255),
  }),
});
