const VerifyPhoneService = require('../Services/VerifyPhoneService');

class VerifyPhoneController {
  async handle(request, response, next) {
    try {
      const result = await VerifyPhoneService.execute({
        userId: request.user.id,
        code: request.validated.body.code,
      });

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new VerifyPhoneController();
