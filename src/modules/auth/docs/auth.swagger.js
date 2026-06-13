/**
 * @swagger
 *
 * tags:
 *   - name: Authentication
 *     description: Authentication and account management
 */

/**
 * @swagger
 *
 * /auth/verify-email/{token}:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Verify user email
 *     description: Activates a user account using the verification token sent by email.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 *
 * /auth/resend-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Resend verification email
 *     description: Generates a new verification token and sends a new verification email if the account is not yet verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@email.com
 *     responses:
 *       200:
 *         description: Verification email sent or queued
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticates a user and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@email.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     is_email_verified:
 *                       type: boolean
 *                     is_active:
 *                       type: boolean
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified or account disabled
 */

/**
 * @swagger
 *
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get authenticated user
 *     description: Returns the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 is_email_verified:
 *                   type: boolean
 *                 is_active:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */
