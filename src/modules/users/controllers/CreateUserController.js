const { CreateUserService } = require('../services');

class CreateUserController {
  async handle(request, response, next) {
    try {
      const user = await CreateUserService.execute(request.body);

      return response.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CreateUserController();
