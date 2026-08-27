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
        'Create a user account. Email verification is sent automatically. If a phone number is provided, a six-digit phone verification code valid for one hour is also sent automatically. An optional avatar may be uploaded.',
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
      summary: 'Update user account',
      description:
        'Update editable account data. Only email, phone and avatar may be changed. First name, last name and CPF are immutable after account creation. Changing the email address requires email revalidation and revokes existing refresh-token sessions. Changing the phone number requires phone revalidation and automatically sends a new six-digit verification code valid for one hour.',

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
          description: 'User account updated successfully',

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
                    $ref: '#/components/schemas/User',
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
          $ref: '#/components/responses/Unauthorized',
        },
        403: {
          description: 'Authenticated user cannot update another account',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              example: {
                success: false,
                message: 'You are not allowed to update this user.',
              },
            },
          },
        },

        404: {
          description: 'User account was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              example: {
                success: false,
                message: 'User not found.',
              },
            },
          },
        },
        409: {
          description: 'Email or phone is already registered',
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

        413: {
          description: 'Uploaded avatar exceeds the configured size limit',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },

              example: {
                success: false,

                message: 'Uploaded file exceeds the maximum allowed size.',
              },
            },
          },
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },

    delete: {
      tags: ['Users'],
      summary: 'Request account deletion',
      description:
        'Request account deletion. The account is immediately deactivated, all sessions are revoked and deletion is scheduled after the configured grace period. Before the recovery period expires, the account may be restored through POST /auth/reactivate-account using valid credentials.',
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
        'Temporarily deactivate the authenticated user account and revoke all refresh-token sessions. The account may later be reactivated through POST /auth/reactivate-account using valid account credentials.',
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
