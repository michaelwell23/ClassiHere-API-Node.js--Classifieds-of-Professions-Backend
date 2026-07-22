const MeService = require('./MeService');

const UserResponseDTO = require('../../users/user-response.dto');

class MeController {
  async handle(request, response, next) {
    try {
      const result = await MeService.execute(request.user.id);

      return response.status(200).json(UserResponseDTO(result));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new MeController();
