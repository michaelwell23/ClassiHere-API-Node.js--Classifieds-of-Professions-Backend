const { Router } = require('express');

const loginDTO = require('./Login/login.dto');
const refreshTokenDTO = require('./RefreshToken/refresh-token.dto');
const logoutDTO = require('./Logout/logout.dto');
const verifyEmailDTO = require('./VerifyEmail/verify-email.dto');
const resendVerificationDTO = require('./ResendVerification/resend-verification.dto');
const forgotPasswordDTO = require('./ForgotPassword/forgot-password.dto');
const resetPasswordDTO = require('./ResetPassword/reset-password.dto');
const changePasswordDTO = require('./ChangePassword/change-password.dto');
const verifyPhoneDTO = require('./VerifyPhone/verify-phone.dto');

const LoginController = require('./Login/LoginController');
const LogoutController = require('./Logout/LogoutController');
const RefreshTokenController = require('./RefreshToken/RefreshTokenController');
const LogoutAllController = require('./LogoutAll/LogoutAllController');
const MeController = require('./Me/MeController');
const VerifyEmailController = require('./VerifyEmail/VerifyEmailController');
const ResendVerificationController = require('./ResendVerification/ResendVerificationController');
const ForgotPasswordController = require('./ForgotPassword/ForgotPasswordController');
const ResetPasswordController = require('./ResetPassword/ResetPasswordController');
const ChangePasswordController = require('./ChangePassword/ChangePasswordController');
const VerifyPhoneController = require('./VerifyPhone/VerifyPhoneController');
const SendPhoneVerificationController = require('./SendPhoneVerification/SendPhoneVerificationController');

const validationMiddleware = require('../../shared/middlewares/validation.middleware');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

const authRoutes = Router();

authRoutes.post('/login', validationMiddleware(loginDTO), LoginController.handle);
authRoutes.post('/logout', validationMiddleware(logoutDTO), LogoutController.handle);
authRoutes.post('/logout-all', authMiddleware, LogoutAllController.handle);

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

authRoutes.patch(
  '/verify-phone',
  authMiddleware,
  validationMiddleware(verifyPhoneDTO),
  VerifyPhoneController.handle
);

authRoutes.post('/phone-verification', authMiddleware, SendPhoneVerificationController.handle);

authRoutes.post(
  '/refresh-token',
  validationMiddleware(refreshTokenDTO),
  RefreshTokenController.handle
);

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
