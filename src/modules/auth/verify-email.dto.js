const { z } = require('zod');

module.exports = z.object({
  params: z.object({
    token: z.string().min(10),
  }),
});
