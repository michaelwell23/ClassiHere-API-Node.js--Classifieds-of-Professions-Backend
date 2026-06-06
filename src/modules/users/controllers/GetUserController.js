const { GetUserService } = require('../services');

class GetUserController {
  async handle(request, response, next) {
    try {
      const user = await GetUserService.execute(request.params.id);

      return response.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new GetUserController();
