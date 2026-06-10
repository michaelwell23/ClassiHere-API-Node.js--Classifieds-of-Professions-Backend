/**
 * @swagger
 *
 * /auth/verify-email/{token}:
 *   get:
 *     tags:
 *       - Authentication
 *
 *     summary:
 *       Verify user email
 *
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description:
 *           Email verified successfully
 *
 *       400:
 *         description:
 *           Invalid or expired token
 *
 *       404:
 *         description:
 *           User not found
 */
