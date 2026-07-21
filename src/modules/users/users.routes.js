const { Router } = require('express');

const validate = require('../../shared/middlewares/validation.middleware');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

const upload = require('../../shared/providers/storage/multer.config');
const userIdDTO = require('./user-id.dto');
const createUserDTO = require('./CreateUser/create-user.dto');
const updateUserDTO = require('./UpdateUser/update-user.dto');

const GetUserController = require('./GetUser/GetUserController');
const CreateUserController = require('./CreateUser/CreateUserController');
const UpdateUserController = require('./UpdateUser/UpdateUserController');
const DeleteUserController = require('./DeleteUser/DeleteUserController');
const ChangeAccountStatusController = require('./ChangeAccountStatus/ChangeAccountStatusController');

const usersRoutes = Router();

usersRoutes.post(
  '/',
  upload.single('avatar'),
  validate(createUserDTO),
  CreateUserController.handle
);

usersRoutes.patch(
  '/:id',
  authMiddleware,
  upload.single('avatar'),
  validate(updateUserDTO),
  UpdateUserController.handle
);

usersRoutes.get('/:id', authMiddleware, validate(userIdDTO), GetUserController.handle);

usersRoutes.delete('/:id', authMiddleware, validate(userIdDTO), DeleteUserController.handle);

usersRoutes.patch(
  '/:id/deactivate',
  authMiddleware,
  validate(userIdDTO),
  ChangeAccountStatusController.handle
);

module.exports = usersRoutes;
