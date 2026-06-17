/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate user
 *     description: Authenticates a verified user and returns access and refresh tokens.
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify user email
 *     description: Verifies the user's email using the verification token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: 7f7b25c9-2f86-4cb0-a879-4d6b55d35c5f
 *     responses:
 *       200:
 *         description: Email successfully verified
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Resend verification email
 *     description: Sends a new email verification token.
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
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification email sent
 *       404:
 *         description: User not found
 *       400:
 *         description: Email already verified
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Generate new access token
 *     description: Generates a new access token and refresh token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens successfully renewed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout current session
 *     description: Revokes the current refresh token and terminates the active session.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout successfully completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Invalid refresh token
 */

/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout all sessions
 *     description: Revokes all active sessions for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All sessions revoked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All sessions have been revoked successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get authenticated user
 *     description: Returns the authenticated user's information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 email_verified:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
