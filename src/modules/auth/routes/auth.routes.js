const { Router } = require('express');

const validationMiddleware = require('../../../shared/middlewares/validation.middleware');

const verifyEmailDTO = require('../dtos/verify-email.dto');
const resendVerificationDTO = require('../dtos/resend-verification.dto');
const loginDTO = require('../dtos/login.dto');

const VerifyEmailController = require('../controllers/VerifyEmailController');
const ResendVerificationController = require('../controllers/ResendVerificationController');
const LoginController = require('../controllers/LoginController');

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

module.exports = authRoutes;
