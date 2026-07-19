const { z } = require('zod');

const isValidCPF = require('../../../shared/utils/cpf.utils');

const createUserDTO = z.object({
  body: z
    .object({
      first_name: z
        .string()
        .trim()
        .min(2, 'First name must contain at least 2 characters')
        .max(100, 'First name must contain at most 100 characters'),

      last_name: z
        .string()
        .trim()
        .min(2, 'Last name must contain at least 2 characters')
        .max(100, 'Last name must contain at most 100 characters'),

      email: z
        .string()
        .trim()
        .email('Invalid email')
        .transform((email) => email.toLowerCase()),

      password: z
        .string()
        .min(8, 'Password must contain at least 8 characters')
        .max(100, 'Password must contain at most 100 characters'),

      phone: z.string().trim().min(1, 'Phone cannot be empty').optional(),

      cpf: z.string().trim().refine(isValidCPF, {
        message: 'Invalid CPF',
      }),
    })
    .strict(),
});

module.exports = createUserDTO;
