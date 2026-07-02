module.exports = {
  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Authenticate user',
      description: 'Authenticate a verified user and return access and refresh tokens.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'joe.doe@uk.org',
                },
                password: {
                  type: 'string',
                  example: '12345678',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User authenticated successfully.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation failed.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'Invalid credentials.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        500: {
          description: 'Internal server error.',
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

  '/auth/refresh-token': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      description: 'Generate a new access token using a valid refresh token.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refresh_token'],
              properties: {
                refresh_token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIs...',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Access token refreshed successfully.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RefreshTokenResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        500: {
          description: 'ApiError.',
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

  '/auth/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout current session',
      description: 'Invalidate the provided refresh token.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refresh_token'],
              properties: {
                refresh_token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIs...',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Logout successfully.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },
        500: {
          description: 'ApiError.',
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

  '/auth/logout-all': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout all sessions',
      description: 'Invalidate all refresh tokens of the authenticated user.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      200: {
        description: 'All sessions revoked successfully.',

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MessageResponse',
            },
          },
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },
      },
    },
  },

  '/auth/me': {
    get: {
      tags: ['Authentication'],
      summary: 'Get authenticated user',
      description: 'Return authenticated user information.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Authenticated user information.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MeResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        500: {
          description: 'ApiError.',
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

  '/auth/verify-email': {
    post: {
      tags: ['Authentication'],
      summary: 'Verify email address',
      description: 'Validate email verification token.',
      parameters: [
        {
          name: 'token',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: 'email-verification-token-xyz123',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['token'],
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Email verified successfully.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        500: {
          description: 'ApiError.',
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

  '/auth/resend-verification': {
    post: {
      tags: ['Authentication'],
      summary: 'Resend verification email',
      description: 'Generate a new email verification token and send a new email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'joe.doe@uk.org',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Verification email sent successfully',
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        500: {
          description: 'ApiError.',
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

  '/auth/forgot-password': {
    post: {
      tags: ['Authentication'],
      summary: 'Request password recovery',
      description: 'Generate a password reset token and send a recovery email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'joe.doe@uk.org',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password recovery email processed.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },
      },
    },
  },

  '/auth/reset-password': {
    post: {
      tags: ['Authentication'],
      summary: 'Reset password',
      description: 'Reset user password using a valid recovery token.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['resetId', 'token', 'password'],
              properties: {
                resetId: {
                  type: 'string',
                  format: 'uuid',
                  example: 'a6f2d4f6-b7b3-4c39-bf62-7f7df3b9c4d2',
                },
                token: {
                  type: 'string',
                  example: 'reset-token-123456',
                },
                password: {
                  type: 'string',
                  example: 'newPassword123',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password updated successfully.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        500: {
          description: 'ApiError.',
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

  '/auth/change-password': {
    patch: {
      tags: ['Authentication'],
      summary: 'Change password',
      description: 'Change authenticated user password and revoke all active sessions.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['currentPassword', 'newPassword'],
              properties: {
                currentPassword: {
                  type: 'string',
                  example: '12345678',
                },
                newPassword: {
                  type: 'string',
                  example: 'newPassword123',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password changed successfully.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        500: {
          description: 'ApiError.',
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

  'auth/verify-phone': {
    patch: {
      tags: ['Authentication'],
      summary: 'Verify phone number',
      description: 'Validate phone verification code.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code'],
              properties: {
                code: {
                  type: 'string',
                  example: '123456',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Phone verified successfully.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },

        401: {
          description: 'UnathourizedError.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        500: {
          description: 'ApiError.',
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
