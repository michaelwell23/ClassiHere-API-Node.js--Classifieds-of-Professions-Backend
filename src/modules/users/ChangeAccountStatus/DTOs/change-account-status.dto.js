const { z } = require('zod');

module.exports = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
