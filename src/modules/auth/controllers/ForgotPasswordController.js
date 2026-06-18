const ForgotPasswordService = require('../services/ForgotPasswordService');

class ForgotPasswordController {
  async handle(request, response, next) {
    try {
      const { email } = request.validated.body;

      const result = await ForgotPasswordService.execute(email);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ForgotPasswordController();
