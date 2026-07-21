const { z } = require('zod');

const userIdDTO = z.object({
  params: z
    .object({
      id: z.string().uuid('Invalid user ID'),
    })
    .strict(),
});

module.exports = userIdDTO;
