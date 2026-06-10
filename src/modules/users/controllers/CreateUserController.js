const CreateUserService = require('../services/CreateUserService');

const userResponseDTO = require('../dtos/user-response.dto');

class CreateUserController {
  async handle(request, response, next) {
    try {
      const user = await CreateUserService.execute(request.body);

      return response.status(201).json({
        success: true,
        data: userResponseDTO(user),
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CreateUserController();
