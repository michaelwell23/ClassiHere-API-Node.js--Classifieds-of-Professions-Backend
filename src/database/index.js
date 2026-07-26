const { Sequelize } = require('sequelize');

const databaseConfig = require('../config/database');
const environment = require('../config/environment');

const User = require('./models/User');
const UserVerification = require('./models/UserVerification');
const UserPhoneVerification = require('./models/UserPhoneVerification');
const UserRefreshToken = require('./models/UserRefreshToken');
const PasswordResetToken = require('./models/PasswordResetToken');
const Term = require('./models/Term');
const UserTermAcceptance = require('./models/UserTermAcceptance');

const config = databaseConfig[environment.nodeEnv];

if (!config) {
  throw new Error(`Database configuration not found for NODE_ENV=${environment.nodeEnv}`);
}

const database = new Sequelize(config);

const models = [
  User,
  UserVerification,
  UserPhoneVerification,
  UserRefreshToken,
  PasswordResetToken,
  Term,
  UserTermAcceptance,
];

for (const model of models) {
  model.init(database);
}

for (const model of models) {
  if (typeof model.associate === 'function') {
    model.associate(database.models);
  }
}

module.exports = database;
