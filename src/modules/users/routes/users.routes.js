const { Router } = require('express');

const validate = require('../../../shared/validators/validate');

const createUserDTO = require('../dtos/create-user.dto');
const updateUserDTO = require('../dtos/update-user.dto');
const userIdDTO = require('../dtos/user-id.dto');

const {
  CreateUserController,
  GetUserController,
  UpdateUserController,
  DeleteUserController,
} = require('../controllers');

const usersRoutes = Router();

usersRoutes.post('/', validate(createUserDTO), CreateUserController.handle);
usersRoutes.get('/:id', validate(userIdDTO), GetUserController.handle);
usersRoutes.put('/:id', validate(updateUserDTO), UpdateUserController.handle);
usersRoutes.delete('/:id', validate(userIdDTO), DeleteUserController.handle);

module.exports = usersRoutes;
