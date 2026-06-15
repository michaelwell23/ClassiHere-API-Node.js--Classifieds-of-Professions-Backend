const { Router } = require('express');

const VerifyEmailController = require('../controllers/VerifyEmailController');
const ResendVerificationController = require('../controllers/ResendVerificationController');
const LoginController = require('../controllers/LoginController');
const MeController = require('../controllers/MeController');
const RefreshTokenController = require('../controllers/RefreshTokenController');
const LogoutController = require('../controllers/LogoutController');

const logoutDTO = require('../dtos/logout.dto');
const verifyEmailDTO = require('../dtos/verify-email.dto');
const resendVerificationDTO = require('../dtos/resend-verification.dto');
const loginDTO = require('../dtos/login.dto');
const refreshTokenDTO = require('../dtos/refresh-token.dto');

const validationMiddleware = require('../../../shared/middlewares/validation.middleware');
const authMiddleware = require('../../../shared/middlewares/auth.middleware');

const authRoutes = Router();

authRoutes.post('/login', validationMiddleware(loginDTO), LoginController.handle);
authRoutes.post('/logout', validationMiddleware(logoutDTO), LogoutController.handle);

authRoutes.post(
  '/refresh-token',
  validationMiddleware(refreshTokenDTO),
  RefreshTokenController.handle
);

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

authRoutes.get('/me', authMiddleware, MeController.handle);

module.exports = authRoutes;
