const { z } = require('zod');

const isValidCPF = require('../../../shared/utils/cpf.utils');

const createUserDTO = z.object({
  body: z.object({
    first_name: z.string().min(2).max(100),
    last_name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    phone: z.string().optional(),
    cpf: z.string().refine(isValidCPF, {
      message: 'Invalid CPF',
    }),
  }),
});

module.exports = createUserDTO;
