const escapeHtml = require('../../../../templates/mail/components/escape-html');

const mailLayoutTemplate = require('../../../../templates/mail/components/mail-layout.template');

function passwordResetTemplate({ userName, resetLink, expiresInMinutes }) {
  const subject = 'Redefina sua senha do ClassiHere';

  const safeExpiresInMinutes = escapeHtml(expiresInMinutes);

  const text = [
    `Olá, ${userName || 'usuário'}.`,
    '',
    'Recebemos uma solicitação para redefinir a senha da sua conta no ClassiHere.',
    '',
    'Acesse o link abaixo para criar uma nova senha:',
    resetLink,
    '',
    `Este link é válido por ${expiresInMinutes} minutos e só pode ser utilizado uma vez.`,
    '',
    'Caso você não tenha solicitado essa alteração, ignore esta mensagem. Sua senha permanecerá inalterada.',
    '',
    'Equipe ClassiHere',
  ].join('\n');

  const html = mailLayoutTemplate({
    title: subject,

    previewText: 'Use este link para redefinir sua senha do ClassiHere.',

    eyebrow: 'Sua conta, protegida',

    heading: 'Redefinição de senha',

    greetingName: userName,

    paragraphs: [
      'Recebemos uma solicitação para redefinir a senha associada à sua conta no ClassiHere.',
      'Use o botão abaixo para criar uma nova senha.',
    ],

    actionLabel: 'Redefinir minha senha',

    actionUrl: resetLink,

    noticeHtml: `
      Este link expira em
      <strong>${safeExpiresInMinutes} minutos</strong>
      e só pode ser utilizado uma vez.
    `,

    securityHtml: `
      <strong style="color: #44506a;">
        Você não solicitou essa alteração?
      </strong>

      <br>

      Ignore este e-mail. Sua senha continuará a
      mesma. Por segurança, não compartilhe este
      link com ninguém.
    `,
  });

  return {
    subject,
    html,
    text,
  };
}

module.exports = passwordResetTemplate;
