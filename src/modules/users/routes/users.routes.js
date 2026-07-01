const { Router } = require('express');

const validate = require('../../../shared/middlewares/validation.middleware');
const upload = require('../../../shared/middlewares/upload.middleware');

const createUserDTO = require('../dtos/create-user.dto');
const updateUserDTO = require('../dtos/update-user.dto');
const userIdDTO = require('../dtos/get-user.dto');

const CreateUserController = require('../controllers/CreateUserController');
const GetUserController = require('../controllers/GetUserController');
const UpdateUserController = require('../controllers/UpdateUserController');
const DeleteUserController = require('../controllers/DeleteUserController');

const usersRoutes = Router();

usersRoutes.post(
  '/',
  validate(createUserDTO),
  upload.single('avatar'),
  CreateUserController.handle
);
usersRoutes.put(
  '/:id',
  upload.single('avatar'),
  validate(updateUserDTO),
  UpdateUserController.handle
);
usersRoutes.get('/:id', validate(userIdDTO), GetUserController.handle);
usersRoutes.delete('/:id', validate(userIdDTO), DeleteUserController.handle);

module.exports = usersRoutes;
