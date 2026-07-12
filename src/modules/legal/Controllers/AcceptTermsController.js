const AcceptTermsService = require('../Services/AcceptTermsService');

class AcceptTermsController {
  async handle(request, response, next) {
    try {
      const result = await AcceptTermsService.execute({
        userId: request.user.id,
        ipAddress: request.ip,
        userAgent: request.get('user-agent'),
      });

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AcceptTermsController();
