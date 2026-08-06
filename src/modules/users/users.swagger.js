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

const userIdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'UUID of the user account. Authenticated users may only access their own account.',
  schema: {
    type: 'string',
    format: 'uuid',
  },

  example: 'd6f2f9b5-f6a5-4f0f-97b0-1c68f36a8e54',
};

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

const errorResponse = (description, message) => ({
  description,
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/ApiError',
      },
      example: {
        success: false,
        message,
      },
    },
  },
});

module.exports = {
  '/users': {
    post: {
      tags: ['Users'],
      summary: 'Create user account',
      description:
        'Create a user account with an optional avatar. The uploaded image is resized to 400 × 400 pixels, converted to WebP and the original file is discarded.',
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              $ref: '#/components/schemas/CreateUserRequest',
            },
            encoding: {
              avatar: {
                contentType: 'image/jpeg, image/png, image/webp',
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: 'User account created successfully',
          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/User',
              }),
              example: {
                success: true,
                data: {
                  id: 'd6f2f9b5-f6a5-4f0f-97b0-1c68f36a8e54',
                  first_name: 'Michael',
                  last_name: 'Walker',
                  email: 'michael.walker@example.com',
                  phone: '5511999999999',
                  avatar_url:
                    'http://localhost:3333/avatars/users/63de543b-53dc-45d7-b5af-a260085b4ba3.webp',
                  is_email_verified: false,
                  is_phone_verified: false,
                  is_active: true,
                  created_at: '2026-08-06T12:00:00.000Z',
                  updated_at: '2026-08-06T12:00:00.000Z',
                },
              },
            },
          },
        },

        400: validationErrorResponse,
        409: {
          description: 'Email, CPF or phone is already registered',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                emailAlreadyRegistered: {
                  value: {
                    success: false,

                    message: 'Email is already registered.',
                  },
                },
                cpfAlreadyRegistered: {
                  value: {
                    success: false,
                    message: 'CPF is already registered.',
                  },
                },
                phoneAlreadyRegistered: {
                  value: {
                    success: false,
                    message: 'Phone is already registered.',
                  },
                },
              },
            },
          },
        },

        413: errorResponse(
          'Uploaded avatar exceeds the configured size limit',
          'Uploaded file exceeds the maximum allowed size.'
        ),
        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Get user account',
      description:
        'Return the profile of the authenticated user. Access to another user account is forbidden.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [userIdParameter],
      responses: {
        200: {
          description: 'User account returned successfully',
          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/User',
              }),
            },
          },
        },

        400: validationErrorResponse,
        401: {
          $ref: '#/components/responses/Unauthorized',
        },
        403: errorResponse(
          'Authenticated user cannot access another account',
          'You are not allowed to access this user.'
        ),
        404: errorResponse('User account was not found', 'User not found.'),
        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },

    patch: {
      tags: ['Users'],
      summary: 'Update user profile',
      description:
        'Partially update the authenticated user profile. A new avatar may be uploaded. Changing the phone number resets phone verification.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [userIdParameter],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              $ref: '#/components/schemas/UpdateUserRequest',
            },
            encoding: {
              avatar: {
                contentType: 'image/jpeg, image/png, image/webp',
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User profile updated successfully',

          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/User',
              }),
            },
          },
        },

        400: validationErrorResponse,
        401: {
          $ref: '#/components/responses/Unauthorized',
        },
        403: errorResponse(
          'Authenticated user cannot update another account',
          'You are not allowed to update this user.'
        ),
        404: errorResponse('User account was not found', 'User not found.'),
        409: errorResponse('Phone number is already registered', 'Phone is already registered.'),
        413: errorResponse(
          'Uploaded avatar exceeds the configured size limit',
          'Uploaded file exceeds the maximum allowed size.'
        ),
        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },

    delete: {
      tags: ['Users'],
      summary: 'Request account deletion',
      description:
        'Request deletion of the authenticated user account. The account is immediately deactivated and all sessions are revoked. The account is soft deleted after the configured grace period, currently 90 days.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [userIdParameter],
      responses: {
        202: {
          description: 'Account deletion request accepted',
          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),
              example: {
                success: true,
                data: {
                  message: 'Account deletion requested successfully.',
                },
              },
            },
          },
        },

        400: validationErrorResponse,
        401: {
          $ref: '#/components/responses/Unauthorized',
        },
        403: errorResponse(
          'Authenticated user cannot request deletion of another account',
          'You are not allowed to request deletion of this account.'
        ),
        404: errorResponse('User account was not found', 'User not found.'),
        409: errorResponse(
          'Account deletion was already requested',
          'Account deletion has already been requested.'
        ),
        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/users/{id}/deactivate': {
    patch: {
      tags: ['Users'],
      summary: 'Deactivate user account',
      description:
        'Temporarily deactivate the authenticated user account and revoke all refresh-token sessions. Deactivation does not schedule automatic deletion.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [userIdParameter],
      responses: {
        200: {
          description: 'User account deactivated successfully',
          content: {
            'application/json': {
              schema: successDataResponse({
                $ref: '#/components/schemas/MessageData',
              }),
              example: {
                success: true,
                data: {
                  message: 'User account deactivated successfully.',
                },
              },
            },
          },
        },

        400: validationErrorResponse,
        401: {
          $ref: '#/components/responses/Unauthorized',
        },
        403: errorResponse(
          'Authenticated user cannot deactivate another account',
          'You are not allowed to deactivate this account.'
        ),
        404: errorResponse('User account was not found', 'User not found.'),
        409: errorResponse(
          'User account is already deactivated',
          'User account is already deactivated.'
        ),
        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },
};
