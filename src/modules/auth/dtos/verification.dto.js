const { z } = require('zod');

const verifyEmailDTO = z
  .object({
    params: z
      .object({
        token: z
          .string({
            required_error: 'Verification token is required.',
          })
          .trim()
          .regex(/^[a-f0-9]{64}$/i, 'Invalid verification token.'),
      })
      .strict(),
  })
  .strict();

const resendVerificationDTO = z
  .object({
    body: z
      .object({
        email: z
          .string({
            required_error: 'Email is required.',
          })
          .trim()
          .email('Invalid email format.')
          .transform((value) => value.toLowerCase()),
      })
      .strict(),
  })
  .strict();

const verifyPhoneDTO = z
  .object({
    body: z
      .object({
        code: z
          .string({
            required_error: 'Verification code is required.',
          })
          .trim()
          .regex(/^\d{6}$/, 'Verification code must contain exactly 6 digits.'),
      })
      .strict(),
  })
  .strict();

module.exports = {
  verifyEmailDTO,
  resendVerificationDTO,
  verifyPhoneDTO,
};
