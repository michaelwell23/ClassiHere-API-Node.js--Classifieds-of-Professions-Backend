function parsePort(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

module.exports = {
  host: process.env.MAIL_HOST,
  port: parsePort(process.env.MAIL_PORT, 587),
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_FROM,
};
