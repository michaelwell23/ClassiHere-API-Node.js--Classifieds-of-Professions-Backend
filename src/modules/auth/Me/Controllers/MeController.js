const MeService = require('../Services/MeService');

const userResponseDTO = require('../../../../shared/DTOs/responses/user-response.dto');

class MeController {
  async handle(request, response, next) {
    try {
      const result = await MeService.execute(request.user.id);

      return response.status(200).json(userResponseDTO(result));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new MeController();
