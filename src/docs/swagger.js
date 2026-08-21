const authPaths = require('../modules/auth/auth.swagger');

const usersPaths = require('../modules/users/users.swagger');

module.exports = {
  openapi: '3.0.3',

  info: {
    title: 'ClassiHere API',

    version: '1.0.0',

    description: 'API oficial da plataforma ClassiHere.',
  },

  servers: [
    {
      url: 'http://localhost:3333',

      description: 'Local development environment',
    },
  ],

  tags: [
    {
      name: 'Authentication',

      description: 'Authentication, session, password and identity verification endpoints.',
    },

    {
      name: 'Users',

      description: 'User account and profile management endpoints.',
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',

        description: 'JWT access token returned by the login or refresh-token endpoint.',
      },
    },

    schemas: {
      User: {
        type: 'object',

        required: [
          'id',
          'first_name',
          'last_name',
          'email',
          'is_email_verified',
          'is_phone_verified',
          'is_active',
          'created_at',
          'updated_at',
        ],

        properties: {
          id: {
            type: 'string',
            format: 'uuid',

            example: 'd6f2f9b5-f6a5-4f0f-97b0-1c68f36a8e54',
          },

          first_name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            example: 'Michael',
          },

          last_name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            example: 'Walker',
          },

          email: {
            type: 'string',
            format: 'email',

            example: 'michael.walker@example.com',
          },

          phone: {
            type: 'string',
            nullable: true,
            example: '+5511999999999',
          },

          avatar_url: {
            type: 'string',
            format: 'uri',
            nullable: true,

            example:
              'http://localhost:3333/avatars/users/a39a917d-11ad-42b7-b028-f3ecb539fd1c.webp',
          },

          is_email_verified: {
            type: 'boolean',
            example: true,
          },

          is_phone_verified: {
            type: 'boolean',
            example: false,
          },

          is_active: {
            type: 'boolean',
            example: true,
          },

          created_at: {
            type: 'string',
            format: 'date-time',

            example: '2026-08-02T15:00:00.000Z',
          },

          updated_at: {
            type: 'string',
            format: 'date-time',

            example: '2026-08-02T15:00:00.000Z',
          },
        },
      },

      AuthTokens: {
        type: 'object',

        required: ['access_token', 'refresh_token'],

        properties: {
          access_token: {
            type: 'string',

            description: 'Short-lived JWT access token.',

            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },

          refresh_token: {
            type: 'string',

            description: 'Long-lived JWT refresh token used for session rotation.',

            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },

      LoginData: {
        type: 'object',

        required: ['user', 'tokens'],

        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },

          tokens: {
            $ref: '#/components/schemas/AuthTokens',
          },
        },
      },

      LoginRequest: {
        type: 'object',

        additionalProperties: false,

        required: ['email', 'password'],

        properties: {
          email: {
            type: 'string',
            format: 'email',

            example: 'michael.walker@example.com',
          },

          password: {
            type: 'string',
            minLength: 1,
            writeOnly: true,
            example: '12345678',
          },
        },
      },

      RefreshTokenRequest: {
        type: 'object',

        additionalProperties: false,

        required: ['refresh_token'],

        properties: {
          refresh_token: {
            type: 'string',
            minLength: 1,
            writeOnly: true,

            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },

      ChangePasswordRequest: {
        type: 'object',

        additionalProperties: false,

        required: ['currentPassword', 'newPassword'],

        properties: {
          currentPassword: {
            type: 'string',
            minLength: 1,
            writeOnly: true,
            example: '12345678',
          },

          newPassword: {
            type: 'string',
            minLength: 8,
            maxLength: 255,
            writeOnly: true,
            example: 'NewPassword123',
          },
        },
      },

      ForgotPasswordRequest: {
        type: 'object',

        additionalProperties: false,

        required: ['email'],

        properties: {
          email: {
            type: 'string',
            format: 'email',

            example: 'michael.walker@example.com',
          },
        },
      },

      ResetPasswordRequest: {
        type: 'object',

        additionalProperties: false,

        required: ['resetId', 'token', 'password'],

        properties: {
          resetId: {
            type: 'string',
            format: 'uuid',

            example: '61b32df4-dbd4-4bb0-9254-7cc7fd49d3e0',
          },

          token: {
            type: 'string',
            minLength: 1,
            writeOnly: true,

            example: '13cce1325d09fd2696d0348c728b608032e3f06caf0a14b8482465d5932cf048',
          },

          password: {
            type: 'string',
            minLength: 8,
            maxLength: 255,
            writeOnly: true,
            example: 'NewPassword123',
          },
        },
      },

      VerifyPhoneRequest: {
        type: 'object',

        additionalProperties: false,

        required: ['code'],

        properties: {
          code: {
            type: 'string',

            pattern: '^\\d{6}$',
            minLength: 6,
            maxLength: 6,

            example: '042781',
          },
        },
      },

      ReactivateAccountRequest: {
        type: 'object',

        additionalProperties: false,

        required: ['email', 'password'],

        properties: {
          email: {
            type: 'string',
            format: 'email',

            example: 'michael.walker@example.com',
          },

          password: {
            type: 'string',
            minLength: 1,
            writeOnly: true,

            example: '12345678',
          },
        },
      },

      MessageData: {
        type: 'object',

        required: ['message'],

        properties: {
          message: {
            type: 'string',

            example: 'Operation completed successfully.',
          },
        },
      },

      ApiError: {
        type: 'object',

        required: ['success', 'message'],

        properties: {
          success: {
            type: 'boolean',
            example: false,
          },

          message: {
            type: 'string',
            example: 'Invalid access token.',
          },

          details: {
            nullable: true,

            description: 'Optional structured error details.',

            oneOf: [
              {
                type: 'object',
              },
              {
                type: 'array',
                items: {},
              },
            ],
          },
        },
      },

      ValidationError: {
        type: 'object',

        required: ['success', 'message', 'details'],

        properties: {
          success: {
            type: 'boolean',
            example: false,
          },

          message: {
            type: 'string',
            example: 'Validation failed',
          },

          details: {
            type: 'object',

            required: ['formErrors', 'fieldErrors'],

            properties: {
              formErrors: {
                type: 'array',

                items: {
                  type: 'string',
                },

                example: [],
              },

              fieldErrors: {
                type: 'object',

                additionalProperties: {
                  type: 'array',

                  items: {
                    type: 'string',
                  },
                },

                example: {
                  body: ['Invalid email format.'],
                },
              },
            },
          },
        },
      },
    },

    responses: {
      Unauthorized: {
        description: 'Authentication is required or the access token is invalid.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },
            example: {
              success: false,
              message: 'Invalid access token.',
            },
          },
        },
      },

      Forbidden: {
        description: 'Authenticated user is not allowed to perform the operation.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },
            example: {
              success: false,
              message: 'User account is deactivated.',
            },
          },
        },
      },

      InternalServerError: {
        description: 'Unexpected internal server error.',

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },

            example: {
              success: false,

              message: 'Internal server error',
            },
          },
        },
      },

      ValidationError: {
        description: 'Request validation failed',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ValidationError',
            },
          },
        },
      },
    },
  },

  paths: {
    ...authPaths,
    ...usersPaths,
  },
};
