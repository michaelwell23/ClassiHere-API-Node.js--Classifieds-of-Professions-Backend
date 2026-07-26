const LogoutService = require('./LogoutService');

class LogoutController {
  async handle(request, response, next) {
    try {
      const result = await LogoutService.execute(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LogoutController();
