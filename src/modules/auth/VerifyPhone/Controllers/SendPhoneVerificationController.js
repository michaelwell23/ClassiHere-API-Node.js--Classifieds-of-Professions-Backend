const SendPhoneVerificationService = require('../services/SendPhoneVerificationService');

class SendPhoneVerificationController {
  async handle(request, response, next) {
    try {
      const result = await SendPhoneVerificationService.execute(request.user.id);

      return response.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SendPhoneVerificationController();
