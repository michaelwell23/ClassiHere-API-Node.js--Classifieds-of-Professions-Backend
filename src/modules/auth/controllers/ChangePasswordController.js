const ChangePasswordService = require('../services/ChangePasswordService');

class ChangePasswordController {
  async handle(request, response, next) {
    try {
      const result = await ChangePasswordService.execute(request.validated.body);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ChangePasswordController();
