const { Router } = require('express');

const validate = require('../../shared/middlewares/validation.middleware');
const authMiddleware = require('../../shared/middlewares/auth.middleware');
const upload = require('../../shared/providers/storage/multer.config');

const userIdDTO = require('./GetUser/get-user.dto');
const createUserDTO = require('./CreateUser/create-user.dto');
const updateUserDTO = require('./UpdateUser/update-user.dto');
const changeAccountStatusDTO = require('./ChangeAccountStatus/change-account-status.dto');

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
  upload.single('avatar'),
  validate(updateUserDTO),
  UpdateUserController.handle
);

usersRoutes.get('/:id', validate(userIdDTO), GetUserController.handle);
usersRoutes.delete('/:id', validate(userIdDTO), DeleteUserController.handle);

usersRoutes.patch(
  '/:id/deactivate',
  authMiddleware,
  validate(changeAccountStatusDTO),
  ChangeAccountStatusController.handle
);

usersRoutes.patch(
  '/:id/reactivate',
  authMiddleware,
  validate(changeAccountStatusDTO),
  ChangeAccountStatusController.handle
);

module.exports = usersRoutes;
