const successDataResponse = (schema) => ({
  type: 'object',

  required: ['success', 'data'],

  properties: {
    success: {
      type: 'boolean',
      example: true,
    },

    data: schema,
  },
});

const errorResponse = (description, example) => ({
  description,

  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/ApiError',
      },

      example: {
        success: false,
        message: example,
      },
    },
  },
});

const validationErrorResponse = {
  description: 'Request validation failed',

  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/ValidationError',
      },
    },
  },
};

module.exports = {
  '/auth/login': {
    post: {
      tags: ['Authentication'],

      summary: 'Authenticate user',

      description:
        'Authenticate a user using email and password. Returns a JWT access token, a refresh token and the authenticated user.',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },

            example: {
              email: 'michael.walker@example.com',
              password: '12345678',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'User authenticated successfully',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/LoginData',
              }),
            },
          },
        },

        400: validationErrorResponse,

        401: errorResponse('Invalid credentials', 'Invalid email or password.'),

        403: errorResponse('User account is deactivated', 'User account is deactivated.'),

        423: errorResponse(
          'User account is temporarily locked',
          'Account temporarily locked due to multiple failed login attempts.'
        ),

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/logout': {
    post: {
      tags: ['Authentication'],

      summary: 'End current session',

      description:
        'Revoke the session associated with the provided refresh token. The operation is idempotent.',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RefreshTokenRequest',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Logout completed successfully',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),

              example: {
                success: true,

                data: {
                  message: 'Logout completed successfully.',
                },
              },
            },
          },
        },

        400: validationErrorResponse,

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/logout-all': {
    post: {
      tags: ['Authentication'],

      summary: 'Revoke all user sessions',

      description: 'Revoke all refresh-token sessions belonging to the authenticated user.',

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: 'All sessions revoked successfully',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),

              example: {
                success: true,

                data: {
                  message: 'All sessions have been revoked successfully.',
                },
              },
            },
          },
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/me': {
    get: {
      tags: ['Authentication'],

      summary: 'Get authenticated user',

      description: 'Return the profile of the currently authenticated user.',

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: 'Authenticated user returned successfully',

          content: {
            'application/json': {
              schema: successDataResponse({
                type: 'object',

                required: ['user'],

                properties: {
                  user: {
                    $ref: '#/components/schemas/User',
                  },
                },
              }),
            },
          },
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        404: errorResponse('User not found', 'User not found.'),

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/refresh-token': {
    post: {
      tags: ['Authentication'],

      summary: 'Rotate refresh token',

      description:
        'Validate and rotate a refresh token. The previous refresh token becomes invalid after successful rotation.',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RefreshTokenRequest',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Tokens rotated successfully',

          content: {
            'application/json': {
              schema: successDataResponse({
                type: 'object',

                required: ['tokens'],

                properties: {
                  tokens: {
                    $ref: '#/components/schemas/AuthTokens',
                  },
                },
              }),
            },
          },
        },

        400: validationErrorResponse,

        401: errorResponse(
          'Refresh token is invalid, expired, revoked or already used',
          'Invalid or revoked refresh token.'
        ),

        403: errorResponse('User account is deactivated', 'User account is deactivated.'),

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/change-password': {
    patch: {
      tags: ['Authentication'],

      summary: 'Change authenticated user password',

      description:
        'Change the password of the authenticated user and revoke all existing refresh-token sessions.',

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ChangePasswordRequest',
            },

            example: {
              currentPassword: '12345678',
              newPassword: 'NewPassword123',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Password changed successfully',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),

              example: {
                success: true,

                data: {
                  message: 'Password changed successfully. All sessions were revoked.',
                },
              },
            },
          },
        },

        400: {
          description:
            'Validation failed, current password is invalid or new password matches current password',

          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    $ref: '#/components/schemas/ValidationError',
                  },
                  {
                    $ref: '#/components/schemas/ApiError',
                  },
                ],
              },
            },
          },
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        404: errorResponse('User not found', 'User not found.'),

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/forgot-password': {
    post: {
      tags: ['Authentication'],

      summary: 'Request password reset',

      description:
        'Request password recovery instructions. The response does not reveal whether the email exists.',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ForgotPasswordRequest',
            },

            example: {
              email: 'michael.walker@example.com',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Password recovery request processed',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),

              example: {
                success: true,

                data: {
                  message: 'If the email exists, password recovery instructions have been sent.',
                },
              },
            },
          },
        },

        400: validationErrorResponse,

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/reset-password': {
    post: {
      tags: ['Authentication'],

      summary: 'Reset password',

      description:
        'Set a new password using a valid password-reset identifier and token. All sessions are revoked after success.',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResetPasswordRequest',
            },

            example: {
              resetId: '61b32df4-dbd4-4bb0-9254-7cc7fd49d3e0',

              token: '13cce1325d09fd2696d0348c728b608032e3f06caf0a14b8482465d5932cf048',

              password: 'NewPassword123',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Password reset successfully',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),

              example: {
                success: true,

                data: {
                  message: 'Password updated successfully. All sessions were revoked.',
                },
              },
            },
          },
        },

        400: {
          description: 'Validation failed or reset token is invalid, expired or already used',

          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    $ref: '#/components/schemas/ValidationError',
                  },
                  {
                    $ref: '#/components/schemas/ApiError',
                  },
                ],
              },
            },
          },
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/verify-email/{token}': {
    get: {
      tags: ['Authentication'],

      summary: 'Verify email address',

      description: 'Verify a user email address using a one-time opaque token.',

      parameters: [
        {
          name: 'token',
          in: 'path',
          required: true,

          description: '64-character hexadecimal email verification token.',

          schema: {
            type: 'string',
            pattern: '^[a-fA-F0-9]{64}$',
            minLength: 64,
            maxLength: 64,
          },

          example: '13cce1325d09fd2696d0348c728b608032e3f06caf0a14b8482465d5932cf048',
        },
      ],

      responses: {
        200: {
          description: 'Email verified or already verified',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),

              examples: {
                verified: {
                  value: {
                    success: true,

                    data: {
                      message: 'Email verified successfully.',
                    },
                  },
                },

                alreadyVerified: {
                  value: {
                    success: true,

                    data: {
                      message: 'Email is already verified.',
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description: 'Token format is invalid, token expired or token was already used',

          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    $ref: '#/components/schemas/ValidationError',
                  },
                  {
                    $ref: '#/components/schemas/ApiError',
                  },
                ],
              },
            },
          },
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/resend-verification': {
    post: {
      tags: ['Authentication'],

      summary: 'Resend email verification',

      description:
        'Request another email verification link. The response does not reveal whether the account exists or is already verified.',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResendVerificationRequest',
            },

            example: {
              email: 'michael.walker@example.com',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Email verification request processed',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),

              example: {
                success: true,

                data: {
                  message: 'If the account still requires verification, a new email has been sent.',
                },
              },
            },
          },
        },

        400: validationErrorResponse,

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/phone/send-verification': {
    post: {
      tags: ['Authentication'],

      summary: 'Send phone verification code',

      description:
        'Generate and send a six-digit verification code to the authenticated user phone number.',

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: 'Phone verification code sent or phone already verified',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),

              examples: {
                sent: {
                  value: {
                    success: true,

                    data: {
                      message: 'Verification code sent successfully.',
                    },
                  },
                },

                alreadyVerified: {
                  value: {
                    success: true,

                    data: {
                      message: 'Phone number is already verified.',
                    },
                  },
                },
              },
            },
          },
        },

        400: errorResponse(
          'User does not have a phone number',
          'User does not have a phone number.'
        ),

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        404: errorResponse('User not found', 'User not found.'),

        429: errorResponse(
          'Verification code requested too frequently',
          'Please wait before requesting another verification code.'
        ),

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/phone/verify': {
    post: {
      tags: ['Authentication'],

      summary: 'Verify phone number',

      description:
        'Verify the authenticated user phone number using a six-digit verification code.',

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/VerifyPhoneRequest',
            },

            example: {
              code: '042781',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Phone verified or already verified',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),

              examples: {
                verified: {
                  value: {
                    success: true,

                    data: {
                      message: 'Phone verified successfully.',
                    },
                  },
                },

                alreadyVerified: {
                  value: {
                    success: true,

                    data: {
                      message: 'Phone number is already verified.',
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description: 'Validation failed or verification code is invalid, expired or already used',

          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    $ref: '#/components/schemas/ValidationError',
                  },
                  {
                    $ref: '#/components/schemas/ApiError',
                  },
                ],
              },
            },
          },
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        404: errorResponse('User not found', 'User not found.'),

        429: errorResponse(
          'Verification attempt limit exceeded',
          'Verification code attempt limit exceeded. Request a new code.'
        ),

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },
};
