const { Router } = require('express');

const VerifyEmailController = require('../controllers/VerifyEmailController');
const ResendVerificationController = require('../controllers/ResendVerificationController');
const LoginController = require('../controllers/LoginController');
const MeController = require('../controllers/MeController');
const RefreshTokenController = require('../controllers/RefreshTokenController');
const LogoutController = require('../controllers/LogoutController');
const LogoutAllController = require('../controllers/LogoutAllController');
const ForgotPasswordController = require('../controllers/ForgotPasswordController');
const ResetPasswordController = require('../controllers/ResetPasswordController');
const ChangePasswordController = require('../controllers/ChangePasswordController');

const resetPasswordDTO = require('../dtos/reset-password.dto');
const logoutDTO = require('../dtos/logout.dto');
const verifyEmailDTO = require('../dtos/verify-email.dto');
const resendVerificationDTO = require('../dtos/resend-verification.dto');
const loginDTO = require('../dtos/login.dto');
const refreshTokenDTO = require('../dtos/refresh-token.dto');
const forgotPasswordDTO = require('../dtos/forgot-password.dto');
const changePasswordDTO = require('../dtos/change-password.dto');

const validationMiddleware = require('../../../shared/middlewares/validation.middleware');
const authMiddleware = require('../../../shared/middlewares/auth.middleware');

const authRoutes = Router();

authRoutes.post('/login', validationMiddleware(loginDTO), LoginController.handle);

authRoutes.get(
  '/verify-email/:token',
  validationMiddleware(verifyEmailDTO),
  VerifyEmailController.handle
);

authRoutes.post(
  '/resend-verification',
  validationMiddleware(resendVerificationDTO),
  ResendVerificationController.handle
);

authRoutes.post(
  '/refresh-token',
  validationMiddleware(refreshTokenDTO),
  RefreshTokenController.handle
);

authRoutes.post('/logout', validationMiddleware(logoutDTO), LogoutController.handle);
authRoutes.post('/logout-all', authMiddleware, LogoutAllController.handle);
authRoutes.get('/me', authMiddleware, MeController.handle);

authRoutes.post(
  '/forgot-password',
  validationMiddleware(forgotPasswordDTO),
  ForgotPasswordController.handle
);

authRoutes.post(
  '/reset-password',
  validationMiddleware(resetPasswordDTO),
  ResetPasswordController.handle
);

authRoutes.patch(
  '/change-password',
  authMiddleware,
  validationMiddleware(changePasswordDTO),
  ChangePasswordController.handle
);

module.exports = authRoutes;
