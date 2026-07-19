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
  validate(createUserDTO),
  upload.single('avatar'),
  CreateUserController.handle
);

usersRoutes.put(
  '/:id',
  validate(updateUserDTO),
  authMiddleware,
  upload.single('avatar'),
  UpdateUserController.handle
);

usersRoutes.get('/:id', validate(userIdDTO), authMiddleware, GetUserController.handle);

usersRoutes.delete('/:id', validate(userIdDTO), authMiddleware, DeleteUserController.handle);

usersRoutes.patch(
  '/:id/deactivate',
  validate(userIdDTO),
  authMiddleware,
  ChangeAccountStatusController.handle
);

usersRoutes.patch(
  '/:id/reactivate',
  validate(userIdDTO),
  authMiddleware,
  ChangeAccountStatusController.handle
);

module.exports = usersRoutes;
