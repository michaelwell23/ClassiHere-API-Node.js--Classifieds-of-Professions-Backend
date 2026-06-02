const express = require('express');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');

const swaggerSpec = require('./docs/swagger');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.use(routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
