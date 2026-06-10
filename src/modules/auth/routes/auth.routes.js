const { Router } = require('express');

const validationMiddleware = require('../../../shared/middlewares/validate.middleware');

const verifyEmailDTO = require('../dtos/verify-email.dto');

const VerifyEmailController = require('../controllers/VerifyEmailController');

const authRoutes = Router();

authRoutes.get(
  '/verify-email/:token',
  validationMiddleware(verifyEmailDTO),
  VerifyEmailController.handle
);

module.exports = authRoutes;
