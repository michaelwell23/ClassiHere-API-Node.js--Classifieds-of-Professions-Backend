const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../docs/swagger');

module.exports = (app) => {
  app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
