const RefreshTokenService = require('./RefreshTokenService');

class RefreshTokenController {
  async handle(request, response, next) {
    try {
      const result = await RefreshTokenService.execute(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RefreshTokenController();
