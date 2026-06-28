const LogoutAllService = require('../Services/LogoutAllService');

class LogoutAllController {
  async handle(request, response, next) {
    try {
      const result = await LogoutAllService.execute(request.user.id);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LogoutAllController();
