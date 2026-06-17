const { Sequelize } = require('sequelize');
const databaseConfig = require('./config');

const User = require('./models/User');
const UserVerification = require('./models/UserVerification');
const UserRefreshToken = require('./models/UserRefreshToken');
const PasswordResetToken = require('./models/PasswordResetToken');

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

const connection = new Sequelize(config);

const models = [User, UserVerification, UserRefreshToken, PasswordResetToken];

models.forEach((model) => model.init(connection));
models.forEach((model) => {
  if (model.associate) {
    model.associate(connection.models);
  }
});

module.exports = connection;
