const env = require('./env');

const port = env.getPositiveInteger('MAIL_PORT', 587);

module.exports = {
  host: env.getString('MAIL_HOST'),
  port,

  secure: env.getBoolean('MAIL_SECURE', port === 465),

  user: env.getString('MAIL_USER'),
  password: env.getString('MAIL_PASSWORD'),

  from: env.getString('MAIL_FROM', env.getString('MAIL_USER')),
};
