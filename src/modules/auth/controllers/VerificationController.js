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

  async resendEmail(request, response, next) {
    try {
      const result = await VerificationService.resendEmail(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async sendPhoneCode(request, response, next) {
    try {
      const result = await VerificationService.sendPhoneCode({
        authenticatedUserId: request.user.id,
      });

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
