const VerifyEmailService = require('./VerifyEmailService');

class VerifyEmailController {
  async handle(request, response, next) {
    try {
      const result = await VerifyEmailService.execute(request.validated.params);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new VerifyEmailController();
