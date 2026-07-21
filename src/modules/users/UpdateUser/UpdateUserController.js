const UpdateUserService = require('./UpdateUserService');

const userResponseDTO = require('../user-response.dto');

class UpdateUserController {
  async handle(request, response, next) {
    try {
      const user = await UpdateUserService.execute({
        id: request.params.id,
        authenticatedUserId: request.user.id,
        data: request.body,
        file: request.file,
      });

      return response.status(200).json({
        success: true,
        data: userResponseDTO(user),
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UpdateUserController();
