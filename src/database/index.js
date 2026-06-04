const { Sequelize } = require('sequelize');

const databaseConfig = require('./config');

const env = process.env.NODE_ENV || 'development';

const config = databaseConfig[env];

const connection = new Sequelize(config);

module.exports = connection;
