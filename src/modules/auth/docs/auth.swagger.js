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
                  example: 'user@classihere.com',
                },
                password: {
                  type: 'string',
                  example: 'Password123',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthTokens',
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

              required: ['refreshToken'],

              properties: {
                refreshToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Token refreshed successfully',
        },

        401: {
          description: 'Invalid refresh token',
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

              required: ['refreshToken'],

              properties: {
                refreshToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Logout completed successfully',
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

      responses: {
        200: {
          description: 'All sessions revoked',
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
          description: 'Authenticated user returned',
        },

        401: {
          description: 'Unauthorized',
        },
      },
    },
  },

  '/auth/verify-email': {
    post: {
      tags: ['Authentication'],

      summary: 'Verify email address',

      description: 'Validate email verification token.',

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
          description: 'Email verified successfully',
        },
        400: {
          description: 'Invalid or expired token',
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
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Recovery instructions sent successfully',
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
                },

                token: {
                  type: 'string',
                },

                password: {
                  type: 'string',
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Password updated successfully',
        },

        400: {
          description: 'Invalid or expired token',
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
                },

                newPassword: {
                  type: 'string',
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Password changed successfully',
        },

        400: {
          description: 'Current password is invalid',
        },

        401: {
          description: 'Unauthorized',
        },
      },
    },
  },
};
