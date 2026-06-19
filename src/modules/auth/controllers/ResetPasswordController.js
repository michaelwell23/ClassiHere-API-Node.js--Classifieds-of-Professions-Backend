const ResetPasswordService = require('../services/ResetPasswordService');

class ResetPasswordController {
  async handle(request, response, next) {
    try {
      const result = await ResetPasswordService.execute(request.validated.body);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ResetPasswordController();
