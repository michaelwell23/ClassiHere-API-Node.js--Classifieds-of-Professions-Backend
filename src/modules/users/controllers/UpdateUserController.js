const { UpdateUserService } = require('../services');

class UpdateUserController {
  async handle(request, response, next) {
    try {
      const user = await UpdateUserService.execute(request.params.id, request.body);

      return response.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UpdateUserController();
