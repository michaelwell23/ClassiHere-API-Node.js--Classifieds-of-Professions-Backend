const RefreshTokenService = require('../Services/RefreshTokenService');

class RefreshTokenController {
  async handle(request, response, next) {
    try {
      const { refresh_token } = request.validated.body;

      const result = await RefreshTokenService.execute(refresh_token);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RefreshTokenController();
