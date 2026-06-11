const ResendVerificationService = require('../services/ResendVerificationService');

class ResendVerificationController {
  async handle(request, response, next) {
    try {
      const { email } = request.validated.body;

      const result = await ResendVerificationService.execute(email);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ResendVerificationController();
