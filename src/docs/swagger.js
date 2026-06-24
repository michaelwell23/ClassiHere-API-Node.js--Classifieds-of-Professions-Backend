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
      url: 'http://localhost:3333/api',
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
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'b6f2d4f6-b7b3-4c39-bf62-7f7df3b9c4d2',
          },
          name: {
            type: 'string',
            example: 'João Silva',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'joao@email.com',
          },
          cpf: {
            type: 'string',
            example: '12345678909',
          },

          emailVerified: {
            type: 'boolean',
            example: true,
          },

          createdAt: {
            type: 'string',
            format: 'date-time',
          },

          updatedAt: {
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
    },
  },

  paths: {
    ...authPaths,
    ...usersPaths,
  },
};
