const PasswordService = require('../services/PasswordService');

class PasswordController {
  async change(request, response, next) {
    try {
      const result = await PasswordService.change({
        authenticatedUserId: request.user.id,

        ...request.validated.body,
      });

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async forgot(request, response, next) {
    try {
      const result = await PasswordService.requestReset(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async reset(request, response, next) {
    try {
      const result = await PasswordService.reset(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PasswordController();
