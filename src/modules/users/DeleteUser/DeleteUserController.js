const DeleteUserService = require('./DeleteUserService');

class DeleteUserController {
  async handle(request, response, next) {
    try {
      const result = await DeleteUserService.execute({
        id: request.params.id,
        authenticatedUserId: request.user.id,
      });

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new DeleteUserController();
