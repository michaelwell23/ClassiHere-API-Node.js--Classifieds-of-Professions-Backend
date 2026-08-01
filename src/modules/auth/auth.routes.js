const { Router } = require('express');

const authMiddleware = require('../../shared/middlewares/auth.middleware');
const validate = require('../../shared/middlewares/validation.middleware');

const SessionController = require('./controllers/SessionController');
const PasswordController = require('./controllers/PasswordController');

const { loginDTO, logoutDTO, refreshTokenDTO } = require('./dtos/session.dto');
const { changePasswordDTO, forgotPasswordDTO, resetPasswordDTO } = require('./dtos/password.dto');

const authRoutes = Router();

authRoutes.post('/login', validate(loginDTO), SessionController.login);
authRoutes.post('/logout', validate(logoutDTO), SessionController.logout);
authRoutes.post('/logout-all', authMiddleware, SessionController.logoutAll);
authRoutes.get('/me', authMiddleware, SessionController.me);
authRoutes.post('/refresh-token', validate(refreshTokenDTO), SessionController.refresh);

authRoutes.patch(
  '/change-password',
  authMiddleware,
  validate(changePasswordDTO),
  PasswordController.change
);
authRoutes.post('/forgot-password', validate(forgotPasswordDTO), PasswordController.forgot);
authRoutes.post('/reset-password', validate(resetPasswordDTO), PasswordController.reset);

module.exports = authRoutes;
