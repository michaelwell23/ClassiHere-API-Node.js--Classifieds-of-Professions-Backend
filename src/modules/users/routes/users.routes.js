const { Router } = require('express');

const validate = require('../../../shared/middlewares/validation.middleware');
const authMiddleware = require('../../../shared/middlewares/auth.middleware');
const upload = require('../../../shared/middlewares/upload.middleware');

const createUserDTO = require('../dtos/create-user.dto');
const updateUserDTO = require('../dtos/update-user.dto');
const userIdDTO = require('../dtos/get-user.dto');
const changeAccountStatusDTO = require('../dtos/change-account-status.dto');

const CreateUserController = require('../controllers/CreateUserController');
const GetUserController = require('../controllers/GetUserController');
const UpdateUserController = require('../controllers/UpdateUserController');
const DeleteUserController = require('../controllers/DeleteUserController');
const ChangeAccountStatusController = require('../controllers/ChangeAccountStatusController');

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
