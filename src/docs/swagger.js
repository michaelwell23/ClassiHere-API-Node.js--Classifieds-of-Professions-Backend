const authPaths = require('../modules/auth/docs/auth.swagger');
const usersPaths = require('../modules/users/docs/users.swagger');

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'ClassiHere API',
    version: '1.0.0',
    description: 'API oficial da plataforma ClassiHere - Guia do Profissional.',
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Local Development',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token obtained through the login endpoint.',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'd6f2f9b5-f6a5-4f0f-97b0-1c68f36a8e54',
          },
          first_name: {
            type: 'string',
            example: 'Joe',
          },
          last_name: {
            type: 'string',
            example: 'Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'joe.doe@uk.org',
          },
          phone: {
            type: 'string',
            nullable: true,
            example: '4335083461',
          },
          cpf: {
            type: 'string',
            example: '***.***.***-**',
            description: 'Masked CPF. The complete CPF is never returned by the API.',
          },
          is_email_verified: {
            type: 'boolean',
            example: true,
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
            example: 'Email verified successfully.',
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
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'email',
                },
                message: {
                  type: 'string',
                  example: 'Invalid email format.',
                },
              },
            },
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
            example: 'Invalid credentials.',
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
    },
  },

  paths: {
    ...authPaths,
    ...usersPaths,
  },
};
