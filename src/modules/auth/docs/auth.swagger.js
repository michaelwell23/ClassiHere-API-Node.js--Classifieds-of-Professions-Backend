/**
 * @swagger
 *
 * tags:
 *   name: Authentication
 *   description: Authentication and email verification
 *
 * /auth/verify-email/{token}:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Verify user email
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 *
 * /auth/resend-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Resend verification email
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
 *                 example: user@email.com
 *     responses:
 *       200:
 *         description: Verification email sent or queued
 *       400:
 *         description: Invalid e-mail
 */
