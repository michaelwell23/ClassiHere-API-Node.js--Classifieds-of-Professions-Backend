const { Router } = require('express');
const AcceptTermsController = require('../Controllers/AcceptTermsController');
const acceptTermsDto = require('../DTOs/accept-terms.dto');

const authMiddleware = require('../../../shared/middlewares/auth.middleware');
const validate = require('../../../shared/middlewares/validation.middleware');

const legalRouter = Router();

legalRouter.post(
  '/terms/accept',
  authMiddleware,
  validate(acceptTermsDto),
  AcceptTermsController.handle
);

module.exports = legalRouter;
