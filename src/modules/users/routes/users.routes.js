const { Router } = require('express');

const validate = require('../../../shared/middlewares/validation.middleware');

const createUserDTO = require('../dtos/create-user.dto');
const updateUserDTO = require('../dtos/update-user.dto');
const userIdDTO = require('../dtos/get-user.dto');

const CreateUserController = require('../controllers/CreateUserController');
const GetUserController = require('../controllers/GetUserController');
const UpdateUserController = require('../controllers/UpdateUserController');
const DeleteUserController = require('../controllers/DeleteUserController');

const usersRoutes = Router();

usersRoutes.post('/', validate(createUserDTO), CreateUserController.handle);
usersRoutes.get('/:id', validate(userIdDTO), GetUserController.handle);
usersRoutes.put('/:id', validate(updateUserDTO), UpdateUserController.handle);
usersRoutes.delete('/:id', validate(userIdDTO), DeleteUserController.handle);

module.exports = usersRoutes;
