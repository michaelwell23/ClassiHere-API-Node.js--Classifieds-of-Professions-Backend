const { Router } = require('express');

const usersRoutes = require('../modules/users/routes/users.routes');
const authRoutes = require('../modules/auth/routes/auth.routes');

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/auth', authRoutes);

module.exports = routes;
