const LoginService = require('./LoginService');

const UserResponseDTO = require('../../users/user-response.dto');

class LoginController {
  async handle(request, response) {
    try {
      const { email, password } = request.validated.body;

      const result = await LoginService.execute({ email, password });

      return response.status(200).json(UserResponseDTO(result));
    } catch (error) {
      return response.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new LoginController();
