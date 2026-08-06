const UserService = require('../services/UserService');

const AccountLifecycleService = require('../services/AccountLifecycleService');

const userResponseDTO = require('../dtos/user-response.dto');

class UserController {
  async create(request, response, next) {
    try {
      const user = await UserService.create({
        data: request.validated.body,

        file: request.validated.file,
      });

      return response.status(201).json({
        success: true,

        data: userResponseDTO(user),
      });
    } catch (error) {
      return next(error);
    }
  }

  async getById(request, response, next) {
    try {
      const user = await UserService.getById({
        authenticatedUserId: request.user.id,

        userId: request.validated.params.id,
      });

      return response.status(200).json({
        success: true,

        data: userResponseDTO(user),
      });
    } catch (error) {
      return next(error);
    }
  }

  async update(request, response, next) {
    try {
      const user = await UserService.update({
        authenticatedUserId: request.user.id,

        userId: request.validated.params.id,

        data: request.validated.body,

        file: request.validated.file,
      });

      return response.status(200).json({
        success: true,

        data: userResponseDTO(user),
      });
    } catch (error) {
      return next(error);
    }
  }

  async remove(request, response, next) {
    try {
      const result = await AccountLifecycleService.requestDeletion({
        authenticatedUserId: request.user.id,

        userId: request.validated.params.id,
      });

      return response.status(202).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async deactivate(request, response, next) {
    try {
      const result = await AccountLifecycleService.deactivate({
        authenticatedUserId: request.user.id,

        userId: request.validated.params.id,
      });

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
