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
              required: ['first_name', 'last_name', 'email', 'password', 'cpf'],
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
                  minLength: 8,
                  maxLength: 100,
                  example: '12345678',
                },
                cpf: {
                  type: 'string',
                  example: '39053344705',
                },
                phone: {
                  type: 'string',
                  example: '11987654321',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        400: {
          description: 'Validation error',
        },
        409: {
          description: 'User already exists',
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
          example: 'd6f2f9b5-f6a5-4f0f-97b0-1c68f36a8e54',
        },
      ],
      responses: {
        200: {
          description: 'User found successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
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
          example: 'd6f2f9b5-f6a5-4f0f-97b0-1c68f36a8e54',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
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
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
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
          example: 'd6f2f9b5-f6a5-4f0f-97b0-1c68f36a8e54',
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
