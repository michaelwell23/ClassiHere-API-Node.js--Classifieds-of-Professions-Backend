const SendPhoneVerificationService = require('./SendPhoneVerificationService');

class SendPhoneVerificationController {
  async handle(request, response, next) {
    try {
      const result = await SendPhoneVerificationService.execute({
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
}

module.exports = new SendPhoneVerificationController();
