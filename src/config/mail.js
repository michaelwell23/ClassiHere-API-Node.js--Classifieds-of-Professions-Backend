const env = require('./env');

const port = env.getPositiveInteger('MAIL_PORT', 587);

module.exports = {
  host: env.getString('MAIL_HOST'),
  port,
  secure: env.getBoolean('MAIL_SECURE', port === 465),
  user: env.getString('MAIL_USER'),
  password: env.getString('MAIL_PASSWORD'),
  from: env.getString('MAIL_FROM', env.getString('MAIL_USER')),
  replyTo: env.getString('MAIL_REPLY_TO', ''),
  connectionTimeout: env.getPositiveInteger('MAIL_CONNECTION_TIMEOUT_MS', 10_000),
  greetingTimeout: env.getPositiveInteger('MAIL_GREETING_TIMEOUT_MS', 10_000),
  socketTimeout: env.getPositiveInteger('MAIL_SOCKET_TIMEOUT_MS', 20_000),
};
