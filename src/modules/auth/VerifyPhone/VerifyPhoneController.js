const VerifyPhoneService = require('./VerifyPhoneService');

class VerifyPhoneController {
  async handle(request, response, next) {
    try {
      const result = await VerifyPhoneService.execute({
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

module.exports = new VerifyPhoneController();
