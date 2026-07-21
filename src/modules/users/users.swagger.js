const userIdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: {
    type: 'string',
    format: 'uuid',
  },
  example: 'd6f2f9b5-f6a5-4f0f-97b0-1c68f36a8e54',
};

const bearerSecurity = [
  {
    bearerAuth: [],
  },
];

module.exports = {
  '/users': {
    post: {
      tags: ['Users'],
      summary: 'Create user',
      description: 'Create a new user account. An avatar may be sent using multipart/form-data.',

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateUserRequest',
            },
          },

          'multipart/form-data': {
            schema: {
              allOf: [
                {
                  $ref: '#/components/schemas/CreateUserRequest',
                },
                {
                  type: 'object',
                  properties: {
                    avatar: {
                      type: 'string',
                      format: 'binary',
                    },
                  },
                },
              ],
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
                $ref: '#/components/schemas/UserResponse',
              },
            },
          },
        },

        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        409: {
          description: 'E-mail, CPF or phone already registered',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictError',
              },
            },
          },
        },

        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
            },
          },
        },
      },
    },
  },

  '/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Get authenticated user',
      description:
        'Return the profile of the authenticated user. A user cannot access another user profile.',

      security: bearerSecurity,
      parameters: [userIdParameter],

      responses: {
        200: {
          description: 'User returned successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserResponse',
              },
            },
          },
        },

        400: {
          description: 'Invalid user ID',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        403: {
          description: 'The authenticated user cannot access this profile',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ForbiddenError',
              },
            },
          },
        },

        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError',
              },
            },
          },
        },

        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
            },
          },
        },
      },
    },

    put: {
      tags: ['Users'],
      summary: 'Update authenticated user',
      description:
        'Update the authenticated user profile. At least one profile field or avatar must be provided.',

      security: bearerSecurity,
      parameters: [userIdParameter],

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateUserRequest',
            },
          },

          'multipart/form-data': {
            schema: {
              allOf: [
                {
                  $ref: '#/components/schemas/UpdateUserRequest',
                },
                {
                  type: 'object',
                  properties: {
                    avatar: {
                      type: 'string',
                      format: 'binary',
                    },
                  },
                },
              ],
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
                $ref: '#/components/schemas/UserResponse',
              },
            },
          },
        },

        400: {
          description: 'Validation error or empty update',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        403: {
          description: 'The authenticated user cannot update this profile',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ForbiddenError',
              },
            },
          },
        },

        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError',
              },
            },
          },
        },

        409: {
          description: 'Phone already registered',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictError',
              },
            },
          },
        },

        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
            },
          },
        },
      },
    },

    delete: {
      tags: ['Users'],
      summary: 'Delete authenticated user',
      description: 'Soft delete the authenticated user account.',

      security: bearerSecurity,
      parameters: [userIdParameter],

      responses: {
        200: {
          description: 'User deleted successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessDataMessageResponse',
              },
            },
          },
        },

        400: {
          description: 'Invalid user ID',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        403: {
          description: 'The authenticated user cannot delete this account',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ForbiddenError',
              },
            },
          },
        },

        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError',
              },
            },
          },
        },

        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
            },
          },
        },
      },
    },
  },

  '/users/{id}/deactivate': {
    patch: {
      tags: ['Users'],
      summary: 'Deactivate authenticated user',
      description: 'Deactivate the authenticated user account and revoke all refresh tokens.',

      security: bearerSecurity,
      parameters: [userIdParameter],

      responses: {
        200: {
          description: 'User account deactivated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessDataMessageResponse',
              },
            },
          },
        },

        400: {
          description: 'Invalid user ID',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        403: {
          description: 'The authenticated user cannot deactivate this account',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ForbiddenError',
              },
            },
          },
        },

        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError',
              },
            },
          },
        },

        409: {
          description: 'User account is already deactivated',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictError',
              },
            },
          },
        },

        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
            },
          },
        },
      },
    },
  },
};
