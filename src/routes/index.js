const { Router } = require('express');

const healthRoutes = require('../modules/health/routes');

const routes = Router();

routes.use('/health', healthRoutes);

module.exports = routes;
