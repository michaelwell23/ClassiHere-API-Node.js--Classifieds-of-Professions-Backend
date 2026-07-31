const LoginService = require('./LoginService');

class LoginController {
  async handle(request, response, next) {
    try {
      const result = await LoginService.execute(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LoginController();
