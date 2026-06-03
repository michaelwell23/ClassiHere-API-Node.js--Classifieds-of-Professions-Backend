const express = require('express');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');

const swaggerSpec = require('./config/swagger');

const notFound = require('./shared/middlewares/notFound');
const errorHandler = require('./shared/middlewares/errorHandler');

const app = express();
app.use(express.json());

app.use(routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
