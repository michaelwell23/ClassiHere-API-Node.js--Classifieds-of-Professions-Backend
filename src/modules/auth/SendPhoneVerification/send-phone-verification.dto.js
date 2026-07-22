const { z } = require('zod');

module.exports = z.object({
  body: z.object({}),
});
