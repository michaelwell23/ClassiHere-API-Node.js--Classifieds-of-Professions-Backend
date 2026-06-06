const { Router } = require('express');

const healthRoutes = require('../modules/health/routes/health.routes');
const usersRoutes = require('../modules/users/routes/users.routes');

const routes = Router();

routes.use('/health', healthRoutes);
routes.use('/users', usersRoutes);

module.exports = routes;
