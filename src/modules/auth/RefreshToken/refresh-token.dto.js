const { z } = require('zod');

module.exports = z.object({
  body: z.object({
    refresh_token: z.string().trim().min(1),
  }),
});
