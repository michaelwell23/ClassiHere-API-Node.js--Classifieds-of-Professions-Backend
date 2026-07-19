const { z } = require('zod');

const updateUserDTO = z
  .object({
    params: z.object({
      id: z.string().uuid('Invalid user ID'),
    }),

    body: z
      .object({
        first_name: z
          .string()
          .trim()
          .min(2, 'First name must contain at least 2 characters')
          .max(100, 'First name must contain at most 100 characters')
          .optional(),

        last_name: z
          .string()
          .trim()
          .min(2, 'Last name must contain at least 2 characters')
          .max(100, 'Last name must contain at most 100 characters')
          .optional(),

        phone: z.string().trim().min(1, 'Phone cannot be empty').optional(),
      })
      .strict(),

    file: z.unknown().optional(),
  })
  .refine(({ body, file }) => Object.keys(body).length > 0 || Boolean(file), {
    message: 'At least one field or avatar must be provided',
    path: ['body'],
  });

module.exports = updateUserDTO;
