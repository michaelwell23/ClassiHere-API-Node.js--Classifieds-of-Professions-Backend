const CreateUserService = require('../CreateUser/CreateUserService');
const GetUserService = require('../GetUser/GetUserService');
const UpdateUserService = require('../UpdateUser/UpdateUserService');
const DeleteUserService = require('../DeleteUser/DeleteUserService');

const ChangeAccountStatusService = require('../ChangeAccountStatus/ChangeAccountStatusService');
const userResponseDTO = require('../dtos/user-response.dto');

class UserController {
  async create(request, response, next) {
    try {
      const user = await CreateUserService.execute({
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
      const user = await GetUserService.execute(request.validated.params.id);
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
      const user = await UpdateUserService.execute({
        id: request.validated.params.id,
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
      const result = await DeleteUserService.execute(request.validated.params.id);
      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async deactivate(request, response, next) {
    try {
      const result = await ChangeAccountStatusService.execute({
        id: request.validated.params.id,
        action: 'deactivate',
      });

      return response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async reactivate(request, response, next) {
    try {
      const result = await ChangeAccountStatusService.execute({
        id: request.validated.params.id,
        action: 'reactivate',
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
