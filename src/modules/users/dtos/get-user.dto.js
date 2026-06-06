const { z } = require('zod');

const getUserDTO = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

module.exports = getUserDTO;
