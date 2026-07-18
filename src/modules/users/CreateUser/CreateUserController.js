const CreateUserService = require('./CreateUserService');

const userResponseDTO = require('../../../shared/DTOs/responses/user-response.dto');

class CreateUserController {
  async handle(request, response, next) {
    try {
      const user = await CreateUserService.execute({
        data: request.body,
        file: request.file,
      });

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
