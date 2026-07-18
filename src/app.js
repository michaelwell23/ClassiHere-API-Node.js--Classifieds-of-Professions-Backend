const express = require('express');
const path = require('path');

const routes = require('./routes/router');

const notFound = require('./shared/middlewares/notFound');
const errorHandler = require('./shared/middlewares/errorHandler');
const setupSwagger = require('./docs/setup-swagger');

const app = express();
setupSwagger(app);

app.use(express.json());
app.use('/storage', express.static(path.resolve(__dirname, '..', 'storage')));

app.use(routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
