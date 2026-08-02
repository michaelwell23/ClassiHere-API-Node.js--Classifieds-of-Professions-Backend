const express = require('express');

const setupSwagger = require('./docs/setup-swagger');

const router = require('./router');

const notFound = require('./shared/middlewares/notFound');
const errorHandler = require('./shared/middlewares/errorHandler');

const app = express();

app.use(express.json());

setupSwagger(app);

app.use(router);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
