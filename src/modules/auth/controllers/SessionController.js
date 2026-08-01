const SessionService = require('../services/SessionService');

class SessionController {
  async login(request, response, next) {
    try {
      const result = await SessionService.login(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async logout(request, response, next) {
    try {
      const result = await SessionService.logout(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async logoutAll(request, response, next) {
    try {
      const result = await SessionService.logoutAll({
        authenticatedUserId: request.user.id,
      });

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async me(request, response, next) {
    try {
      const result = await SessionService.getCurrentUser({
        authenticatedUserId: request.user.id,
      });

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async refresh(request, response, next) {
    try {
      const result = await SessionService.refresh(request.validated.body);

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new SessionController();
