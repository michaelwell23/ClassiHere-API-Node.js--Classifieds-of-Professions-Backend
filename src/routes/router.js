const { Router } = require('express');

const usersRoutes = require('../modules/users/routes/users.routes');
const authRoutes = require('../modules/auth/routes/auth.routes');
const legalRoutes = require('../modules/legal/Routes/legal.routes');

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/auth', authRoutes);
routes.use('/legal', legalRoutes);

module.exports = routes;
