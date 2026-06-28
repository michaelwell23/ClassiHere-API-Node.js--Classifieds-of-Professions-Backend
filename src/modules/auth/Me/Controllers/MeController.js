const MeService = require('../Services/MeService');

class MeController {
  async handle(request, response, next) {
    try {
      const result = await MeService.execute(request.user.id);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new MeController();
