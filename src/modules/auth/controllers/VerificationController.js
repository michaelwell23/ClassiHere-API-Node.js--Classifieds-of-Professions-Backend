const VerificationService = require('../services/VerificationService');

class VerificationController {
  async verifyEmail(request, response, next) {
    try {
      const result = await VerificationService.verifyEmail(request.validated.params);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async verifyPhone(request, response, next) {
    try {
      const result = await VerificationService.verifyPhone({
        authenticatedUserId: request.user.id,
        code: request.validated.body.code,
      });

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new VerificationController();
