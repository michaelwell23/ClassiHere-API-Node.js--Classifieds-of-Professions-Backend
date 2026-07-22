const ChangePasswordService = require('./ChangePasswordService');

class ChangePasswordController {
  async handle(request, response, next) {
    try {
      const result = await ChangePasswordService.execute({
        userId: request.user.id,
        ...request.validated.body,
      });

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ChangePasswordController();
