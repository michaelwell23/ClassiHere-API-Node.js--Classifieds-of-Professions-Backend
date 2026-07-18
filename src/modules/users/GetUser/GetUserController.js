const GetUserService = require('./GetUserService');

const userResponseDTO = require('../../../shared/DTOs/responses/user-response.dto');

class GetUserController {
  async handle(request, response, next) {
    try {
      const user = await GetUserService.execute(request.params.id);

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
