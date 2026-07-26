const nodemailer = require('nodemailer');

const mailConfig = require('../../../config/mail');

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,

      auth:
        mailConfig.user && mailConfig.password
          ? {
              user: mailConfig.user,
              pass: mailConfig.password,
            }
          : undefined,
    });
  }

  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  return getTransporter().sendMail({
    from: mailConfig.from,
    to,
    subject,
    html,
    text,
  });
}

async function verifyConnection() {
  return getTransporter().verify();
}

module.exports = {
  sendMail,
  verifyConnection,
};
