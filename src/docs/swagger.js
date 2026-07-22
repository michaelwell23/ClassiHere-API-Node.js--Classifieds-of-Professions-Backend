const environment = require('../config/environment');

const authPaths = require('../modules/auth/auth.swagger');
const usersPaths = require('../modules/users/users.swagger');

module.exports = {
  openapi: '3.0.0',

  info: {
    title: 'ClassiHere API',
    version: '1.0.0',
    description: 'Official API for the ClassiHere platform.',
  },

  servers: [
    {
      url: environment.appUrl,
      description: environment.nodeEnv === 'production' ? 'Production' : 'Current environment',
    },
  ],

  tags: [
    {
      name: 'Authentication',
      description: 'Authentication and account security endpoints',
    },
    {
      name: 'Users',
      description: 'User profile and account management endpoints',
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token returned by the login endpoint.',
      },
    },

    schemas: {
      CreateUserRequest: {
        type: 'object',
        required: ['first_name', 'last_name', 'email', 'password', 'cpf'],
        additionalProperties: false,

        properties: {
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

          password: {
            type: 'string',
            format: 'password',
            minLength: 8,
            maxLength: 100,
            example: 'SecurePassword123',
          },

          cpf: {
            type: 'string',
            example: '39053344705',
            description:
              'Valid Brazilian CPF. Formatting characters are accepted and removed before persistence.',
          },

          phone: {
            type: 'string',
            example: '11987654321',
            description:
              'Optional phone number. Formatting characters are removed before persistence.',
          },
        },
      },

      UpdateUserRequest: {
        type: 'object',
        minProperties: 1,
        additionalProperties: false,

        properties: {
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

          phone: {
            type: 'string',
            example: '11987654321',
            description: 'Formatting characters are removed before persistence.',
          },
        },
      },

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
            example: 'Michael',
          },

          last_name: {
            type: 'string',
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
            example: '11987654321',
          },

          avatar_url: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'http://localhost:3333/avatars/users/avatar.webp',
          },

          is_email_verified: {
            type: 'boolean',
            example: false,
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
            example: '2026-06-27T15:30:00.000Z',
          },

          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-27T15:30:00.000Z',
          },
        },
      },

      UserResponse: {
        type: 'object',
        required: ['success', 'data'],

        properties: {
          success: {
            type: 'boolean',
            example: true,
          },

          data: {
            $ref: '#/components/schemas/User',
          },
        },
      },

      SuccessDataMessageResponse: {
        type: 'object',
        required: ['success', 'data'],

        properties: {
          success: {
            type: 'boolean',
            example: true,
          },

          data: {
            type: 'object',
            required: ['message'],

            properties: {
              message: {
                type: 'string',
                example: 'Operation completed successfully',
              },
            },
          },
        },
      },

      AuthTokens: {
        type: 'object',

        properties: {
          access_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },

          refresh_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },

      LoginResponse: {
        type: 'object',

        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },

          tokens: {
            $ref: '#/components/schemas/AuthTokens',
          },
        },
      },

      RefreshTokenResponse: {
        type: 'object',

        properties: {
          tokens: {
            $ref: '#/components/schemas/AuthTokens',
          },
        },
      },

      MeResponse: {
        type: 'object',

        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },

      MessageResponse: {
        type: 'object',

        properties: {
          message: {
            type: 'string',
            example: 'Operation completed successfully.',
          },
        },
      },

      SuccessMessageResponse: {
        type: 'object',

        properties: {
          success: {
            type: 'boolean',
            example: true,
          },

          message: {
            type: 'string',
            example: 'Operation completed successfully.',
          },
        },
      },

      ApiError: {
        type: 'object',

        properties: {
          statusCode: {
            type: 'integer',
            example: 500,
          },

          message: {
            type: 'string',
            example: 'Internal server error.',
          },

          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      ValidationError: {
        type: 'object',

        properties: {
          statusCode: {
            type: 'integer',
            example: 400,
          },

          message: {
            type: 'string',
            example: 'Validation failed.',
          },

          details: {
            type: 'object',
            nullable: true,
            additionalProperties: true,
          },

          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      UnauthorizedError: {
        type: 'object',

        properties: {
          statusCode: {
            type: 'integer',
            example: 401,
          },

          message: {
            type: 'string',
            example: 'Invalid authentication token.',
          },

          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      ForbiddenError: {
        type: 'object',

        properties: {
          statusCode: {
            type: 'integer',
            example: 403,
          },

          message: {
            type: 'string',
            example: 'Access denied.',
          },

          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      NotFoundError: {
        type: 'object',

        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },

          message: {
            type: 'string',
            example: 'Resource not found.',
          },

          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      ConflictError: {
        type: 'object',

        properties: {
          statusCode: {
            type: 'integer',
            example: 409,
          },

          message: {
            type: 'string',
            example: 'Resource already exists.',
          },

          timestamp: {
            type: 'string',
            format: 'date-time',
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
