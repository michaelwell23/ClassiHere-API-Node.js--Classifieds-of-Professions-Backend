const GetUserService = require('./GetUserService');

const userResponseDTO = require('../user-response.dto');

class GetUserController {
  async handle(request, response, next) {
    try {
      const user = await GetUserService.execute({
        id: request.params.id,
        authenticatedUserId: request.user.id,
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

module.exports = new GetUserController();
