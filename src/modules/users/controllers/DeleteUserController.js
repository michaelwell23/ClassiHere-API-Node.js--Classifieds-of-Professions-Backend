const DeleteUserService = require('../services/DeleteUserService');

class DeleteUserController {
  async handle(request, response, next) {
    try {
      const { id } = request.validated.params;

      const result = await DeleteUserService.execute(id);

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeleteUserController();
