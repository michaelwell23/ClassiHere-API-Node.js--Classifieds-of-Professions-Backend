const { z } = require('zod');

const isValidCPF = require('../../../shared/utils/cpf.utils');

const userIdParamsSchema = z
  .object({
    id: z
      .string({
        required_error: 'User ID is required.',
      })
      .uuid('Invalid user ID.'),
  })
  .strict();

const avatarFileSchema = z
  .object({
    fieldname: z.literal('avatar'),

    originalname: z.string().min(1),

    encoding: z.string().min(1),

    mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp']),

    size: z.number().int().positive(),

    destination: z.string().min(1),

    filename: z.string().min(1),

    path: z.string().min(1),
  })
  .passthrough();

const createUserDTO = z
  .object({
    body: z
      .object({
        first_name: z
          .string({
            required_error: 'First name is required.',
          })
          .trim()
          .min(2, 'First name must contain at least 2 characters.')
          .max(100, 'First name must contain at most 100 characters.'),

        last_name: z
          .string({
            required_error: 'Last name is required.',
          })
          .trim()
          .min(2, 'Last name must contain at least 2 characters.')
          .max(100, 'Last name must contain at most 100 characters.'),

        email: z
          .string({
            required_error: 'Email is required.',
          })
          .trim()
          .email('Invalid email format.')
          .transform((value) => value.toLowerCase()),

        password: z
          .string({
            required_error: 'Password is required.',
          })
          .min(8, 'Password must contain at least 8 characters.')
          .max(255, 'Password must contain at most 255 characters.'),

        phone: z
          .string({
            required_error: 'Phone is required.',
          })
          .trim()
          .min(10, 'Phone must contain at least 10 digits.')
          .max(20, 'Phone must contain at most 20 characters.'),

        cpf: z
          .string({
            required_error: 'CPF is required.',
          })
          .trim()
          .refine(isValidCPF, {
            message: 'Invalid CPF.',
          }),
      })
      .strict(),

    file: avatarFileSchema.optional(),
  })
  .strict();

const updateUserDTO = z
  .object({
    params: userIdParamsSchema,

    body: z
      .object({
        first_name: z
          .string()
          .trim()
          .min(2, 'First name must contain at least 2 characters.')
          .max(100, 'First name must contain at most 100 characters.')
          .optional(),

        last_name: z
          .string()
          .trim()
          .min(2, 'Last name must contain at least 2 characters.')
          .max(100, 'Last name must contain at most 100 characters.')
          .optional(),

        phone: z
          .string()
          .trim()
          .min(10, 'Phone must contain at least 10 digits.')
          .max(20, 'Phone must contain at most 20 characters.')
          .optional(),
      })
      .strict(),

    file: avatarFileSchema.optional(),
  })
  .strict()
  .refine(({ body, file }) => Object.keys(body).length > 0 || Boolean(file), {
    message: 'At least one field or avatar must be provided.',
    path: ['body'],
  });

const userIdDTO = z
  .object({
    params: userIdParamsSchema,
  })
  .strict();

module.exports = {
  createUserDTO,
  updateUserDTO,
  userIdDTO,
};
