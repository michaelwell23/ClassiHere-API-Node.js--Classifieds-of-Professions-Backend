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

        403: {
          description: 'User account cannot authenticate',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },

              examples: {
                emailVerificationRequired: {
                  value: {
                    success: false,

                    message: 'Email verification is required.',
                  },
                },

                accountDeactivated: {
                  value: {
                    success: false,

                    message: 'User account is deactivated.',
                  },
                },
              },
            },
          },
        },

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

      description:
        'Verify the user email address using the one-time token sent automatically when the account is created.',

      parameters: [
        {
          name: 'token',
          in: 'path',
          required: true,

          schema: {
            type: 'string',
            pattern: '^[a-fA-F0-9]{64}$',
            minLength: 64,
            maxLength: 64,
          },
        },
      ],

      responses: {
        200: {
          description: 'Email verified successfully',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  data: {
                    $ref: '#/components/schemas/MessageData',
                  },
                },
              },

              example: {
                success: true,

                data: {
                  message: 'Email verified successfully.',
                },
              },
            },
          },
        },

        400: {
          description: 'Verification token is invalid, expired or already used',
        },

        403: {
          description: 'User account is deactivated',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/auth/reactivate-account': {
    post: {
      tags: ['Authentication'],

      summary: 'Reactivate user account',

      description:
        'Reactivate a previously deactivated user account using email and password. If an account deletion request is still within the configured recovery period, the deletion request is cancelled. A new authenticated session is created after successful reactivation.',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ReactivateAccountRequest',
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
          description: 'Account reactivated successfully',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                required: ['success', 'data'],

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  data: {
                    $ref: '#/components/schemas/LoginData',
                  },
                },
              },
            },
          },
        },

        400: {
          $ref: '#/components/responses/ValidationError',
        },

        401: {
          description: 'Invalid email or password',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },

              example: {
                success: false,

                message: 'Invalid email or password.',
              },
            },
          },
        },

        403: {
          description: 'Email verification is required',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },

              example: {
                success: false,

                message: 'Email verification is required.',
              },
            },
          },
        },

        409: {
          description: 'Account is already active',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },

              example: {
                success: false,

                message: 'User account is already active.',
              },
            },
          },
        },

        410: {
          description: 'Account recovery period has expired',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },

              example: {
                success: false,

                message: 'Account reactivation period has expired.',
              },
            },
          },
        },

        423: {
          description:
            'Account temporarily locked because of repeated failed authentication attempts',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },

              example: {
                success: false,

                message: 'Account temporarily locked due to multiple failed login attempts.',
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

  '/auth/phone/verify': {
    post: {
      tags: ['Authentication'],

      summary: 'Verify phone number',

      description:
        'Verify the authenticated user phone number using the six-digit code sent automatically during account creation or after the phone number is changed. The code is valid for one hour.',

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
          description: 'Phone verified successfully',

          content: {
            'application/json': {
              schema: {
                type: 'object',

                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },

                  data: {
                    $ref: '#/components/schemas/MessageData',
                  },
                },
              },
            },
          },
        },

        400: {
          description: 'Verification code is invalid or expired',
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        429: {
          description: 'Verification attempt limit exceeded',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },
};
