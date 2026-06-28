const { Router } = require('express');

const LoginController = require('../Login/Controllers/LoginController');
const LogoutController = require('../Logout/Controllers/LogoutController');
const RefreshTokenController = require('../RefreshToken/Controllers/RefreshTokenController');
const LogoutAllController = require('../LogoutAll/Controllers/LogoutAllController');
const MeController = require('../Me/Controllers/MeController');
const VerifyEmailController = require('../VerifyEmail/Controllers/VerifyEmailController');
const ResendVerificationController = require('../ResendVerification/Controllers/ResendVerificationController');
const ForgotPasswordController = require('../ForgotPassword/Controllers/ForgotPasswordController');
const ResetPasswordController = require('../ResetPassword/Controllers/ResetPasswordController');
const ChangePasswordController = require('../ChangePassword/Controllers/ChangePasswordController');

const loginDTO = require('../Login/DTOs/login.dto');
const refreshTokenDTO = require('../RefreshToken/DTOs/refresh-token.dto');
const logoutDTO = require('../Logout/DTOs/logout.dto');
const verifyEmailDTO = require('../VerifyEmail/DTOs/verify-email.dto');
const resendVerificationDTO = require('../ResendVerification/DTOs/resend-verification.dto');
const forgotPasswordDTO = require('../ForgotPassword/DTOs/forgot-password.dto');
const resetPasswordDTO = require('../ResetPassword/DTOs/reset-password.dto');
const changePasswordDTO = require('../ChangePassword/DTOs/change-password.dto');

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
