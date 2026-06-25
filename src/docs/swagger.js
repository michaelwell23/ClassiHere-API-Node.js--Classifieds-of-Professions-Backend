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
      url: 'http://localhost:3333/',
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
            example: '11987654321',
            nullable: true,
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
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
          },

          refreshToken: {
            type: 'string',
          },
        },
      },

      SuccessResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Operation completed successfully',
          },
        },
      },

      ApiError: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Validation error',
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
            example: 'Invalid token',
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
            example: 'Access denied',
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
