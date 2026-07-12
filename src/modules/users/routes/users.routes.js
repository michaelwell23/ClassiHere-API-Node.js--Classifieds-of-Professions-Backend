const { Router } = require('express');

const validate = require('../../../shared/middlewares/validation.middleware');
const authMiddleware = require('../../../shared/middlewares/auth.middleware');
const upload = require('../../../shared/providers/storage/multer.config');

const userIdDTO = require('../GetUser/DTOs/get-user.dto');
const createUserDTO = require('../CreateUsers/DTOs/create-user.dto');
const updateUserDTO = require('../UpdateUsers/DTOs/update-user.dto');
const changeAccountStatusDTO = require('../ChangeAccountStatus/DTOs/change-account-status.dto');

const GetUserController = require('../GetUser/Controllers/GetUserController');
const CreateUserController = require('../CreateUsers/Controllers/CreateUserController');
const UpdateUserController = require('../UpdateUsers/Controllers/UpdateUserController');
const DeleteUserController = require('../DeleteUsers/Controllers/DeleteUserController');
const ChangeAccountStatusController = require('../ChangeAccountStatus/Controllers/ChangeAccountStatusController');

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
