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

      connectionTimeout: mailConfig.connectionTimeout,

      greetingTimeout: mailConfig.greetingTimeout,

      socketTimeout: mailConfig.socketTimeout,
    });
  }

  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  if (!to) {
    throw new TypeError('Mail recipient is required.');
  }

  if (!subject) {
    throw new TypeError('Mail subject is required.');
  }

  if (!html && !text) {
    throw new TypeError('Mail content is required.');
  }

  return getTransporter().sendMail({
    from: mailConfig.from,
    replyTo: mailConfig.replyTo || undefined,
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
