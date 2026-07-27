const ForgotPasswordService = require('./ForgotPasswordService');

class ForgotPasswordController {
  async handle(request, response, next) {
    try {
      const result = await ForgotPasswordService.execute(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ForgotPasswordController();
