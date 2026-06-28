const LoginService = require('../../Login/Services/LoginService');

class LoginController {
  async handle(request, response) {
    try {
      const { email, password } = request.validated.body;

      const result = await LoginService.execute({ email, password });

      return response.status(200).json(result);
    } catch (error) {
      return response.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new LoginController();
