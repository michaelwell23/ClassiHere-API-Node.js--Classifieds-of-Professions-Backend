const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger');

function setupSwagger(app) {
  app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = setupSwagger;
