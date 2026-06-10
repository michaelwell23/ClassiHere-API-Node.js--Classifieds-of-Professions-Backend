const nodemailer = require('nodemailer');

const mailConfig = require('../../../config/mail');

const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: false,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.password,
  },
});

async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: mailConfig.from,
    to,
    subject,
    html,
  });
}

module.exports = {
  sendMail,
};
