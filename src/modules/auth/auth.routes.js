const { Router } = require('express');

const authMiddleware = require('../../shared/middlewares/auth.middleware');

const validate = require('../../shared/middlewares/validation.middleware');

const SessionController = require('./controllers/SessionController');
const PasswordController = require('./controllers/PasswordController');
const VerificationController = require('./controllers/VerificationController');

const {
  loginDTO,
  logoutDTO,
  refreshTokenDTO,
  reactivateAccountDTO,
} = require('./dtos/session.dto');
const { changePasswordDTO, forgotPasswordDTO, resetPasswordDTO } = require('./dtos/password.dto');
const { verifyEmailDTO, verifyPhoneDTO } = require('./dtos/verification.dto');

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

authRoutes.get(
  '/verify-email/:token',
  validate(verifyEmailDTO),
  VerificationController.verifyEmail
);
authRoutes.post(
  '/phone/verify',
  authMiddleware,
  validate(verifyPhoneDTO),
  VerificationController.verifyPhone
);

authRoutes.post(
  '/reactivate-account',
  validate(reactivateAccountDTO),
  SessionController.reactivateAccount
);

module.exports = authRoutes;
