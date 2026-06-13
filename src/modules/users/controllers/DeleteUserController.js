const DeleteUserService = require('../services/DeleteUserService');

class DeleteUserController {
  async handle(request, response, next) {
    try {
      await DeleteUserService.execute(request.params.id);

      return response.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new DeleteUserController();
