const { Router } = require('express');

const authMiddleware = require('../../shared/middlewares/auth.middleware');
const validate = require('../../shared/middlewares/validation.middleware');

const upload = require('../../shared/middlewares/upload.middleware');
const UserController = require('./controllers/UserController');

const { createUserDTO, updateUserDTO, userIdDTO } = require('./dtos/user.dto');

const usersRoutes = Router();

usersRoutes.post('/', upload.single('avatar'), validate(createUserDTO), UserController.create);

usersRoutes.get('/:id', authMiddleware, validate(userIdDTO), UserController.getById);

usersRoutes.patch(
  '/:id',
  authMiddleware,
  upload.single('avatar'),
  validate(updateUserDTO),
  UserController.update
);

usersRoutes.delete('/:id', authMiddleware, validate(userIdDTO), UserController.remove);

usersRoutes.patch(
  '/:id/deactivate',
  authMiddleware,
  validate(userIdDTO),
  UserController.deactivate
);

module.exports = usersRoutes;
