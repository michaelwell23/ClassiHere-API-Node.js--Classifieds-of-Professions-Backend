const MeService = require('./MeService');

class MeController {
  async handle(request, response, next) {
    try {
      const result = await MeService.execute({
        authenticatedUserId: request.user.id,
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

module.exports = new MeController();
