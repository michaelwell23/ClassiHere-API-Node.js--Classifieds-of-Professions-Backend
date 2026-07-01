const express = require('express');
const path = require('path');

const routes = require('./routes/router');

const notFound = require('./shared/middlewares/notFound');
const errorHandler = require('./shared/middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/storage', express.static(path.resolve(__dirname, '..', 'storage')));

app.use(routes);
require('./config/swagger')(app);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
