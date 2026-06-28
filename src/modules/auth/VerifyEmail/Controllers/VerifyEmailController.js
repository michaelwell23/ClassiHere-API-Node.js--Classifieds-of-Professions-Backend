const VerifyEmailService = require('../Services/VerifyEmailService');

class VerifyEmailController {
  async handle(request, response, next) {
    try {
      const { token } = request.params;

      const result = await VerifyEmailService.execute(token);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new VerifyEmailController();
