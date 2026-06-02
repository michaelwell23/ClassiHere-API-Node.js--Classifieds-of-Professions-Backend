const { Router } = require('express');

const healthRoutes = require('./health.routes');

const routes = Router();

routes.use('/health', healthRoutes);

module.exports = routes;
