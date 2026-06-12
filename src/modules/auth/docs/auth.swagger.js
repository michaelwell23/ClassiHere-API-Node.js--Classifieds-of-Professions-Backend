/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary:
 *       User login
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - email
 *               - password
 *
 *             properties:
 *               email:
 *                 type: string
 *
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description:
 *           Login successful
 *
 *       401:
 *         description:
 *           Invalid credentials
 *
 *       403:
 *         description:
 *           Email not verified
 */
