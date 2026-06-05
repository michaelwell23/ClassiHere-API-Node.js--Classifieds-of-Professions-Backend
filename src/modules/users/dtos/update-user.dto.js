const { z } = require('zod');

const updateUserDTO = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),

  body: z.object({
    first_name: z.string().min(2).max(100).optional(),
    last_name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
  }),
});

module.exports = updateUserDTO;
