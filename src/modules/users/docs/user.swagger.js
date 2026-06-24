module.exports = {
  '/users': {
    post: {
      tags: ['Users'],
      summary: 'Create user',
      description: 'Create a new user account and send email verification instructions.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',

              required: ['name', 'email', 'password', 'cpf'],

              properties: {
                name: {
                  type: 'string',
                  example: 'João Silva',
                },

                email: {
                  type: 'string',
                  format: 'email',
                  example: 'joao@email.com',
                },

                password: {
                  type: 'string',
                  example: 'Password123',
                },

                cpf: {
                  type: 'string',
                  example: '12345678909',
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: 'User created successfully',
        },
        400: {
          description: 'Validation error',
        },
        409: {
          description: 'Email already registered',
        },
      },
    },
  },

  '/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Get user by id',
      description: 'Return public information of a specific user.',
      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
      ],

      responses: {
        200: {
          description: 'User found successfully',
        },

        404: {
          description: 'User not found',
        },

        401: {
          description: 'Unauthorized',
        },
      },
    },

    patch: {
      tags: ['Users'],
      summary: 'Update user',
      description: 'Update user profile information.',
      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
      ],

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'User updated successfully',
        },
        400: {
          description: 'Validation error',
        },
        404: {
          description: 'User not found',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },

    delete: {
      tags: ['Users'],
      summary: 'Delete user',
      description: 'Soft delete user account.',
      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
      ],

      responses: {
        204: {
          description: 'User deleted successfully',
        },
        404: {
          description: 'User not found',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },
};
