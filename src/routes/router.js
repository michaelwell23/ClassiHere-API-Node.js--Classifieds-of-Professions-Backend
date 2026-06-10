const { Router } = require('express');

const healthRoutes = require('../modules/health/routes/health.routes');
const usersRoutes = require('../modules/users/routes/users.routes');
const authRoutes = require('../modules/auth/routes/auth.routes');

const routes = Router();

routes.use('/health', healthRoutes);
routes.use('/users', usersRoutes);
routes.use('/auth', authRoutes);

module.exports = routes;
