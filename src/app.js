const express = require('express');

const routes = require('./routes/router');

const notFound = require('./shared/middlewares/notFound');
const errorHandler = require('./shared/middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use(routes);
require('./config/swagger')(app);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
