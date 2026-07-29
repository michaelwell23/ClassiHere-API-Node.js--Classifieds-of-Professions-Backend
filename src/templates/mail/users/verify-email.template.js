const escapeHtml = require('../components/escape-html');

const mailLayoutTemplate = require('../components/mail-layout.template');

function verifyEmailTemplate({ userName, verificationLink, expiresInHours }) {
  const subject = 'Confirme seu e-mail no ClassiHere';

  const safeExpiresInHours = escapeHtml(expiresInHours);

  const text = [
    `Olá, ${userName || 'usuário'}.`,
    '',
    'Confirme seu endereço de e-mail para concluir a configuração da sua conta no ClassiHere.',
    '',
    verificationLink,
    '',
    `Este link é válido por ${expiresInHours} horas e pode ser utilizado apenas uma vez.`,
    '',
    'Caso você não tenha criado uma conta no ClassiHere, ignore esta mensagem.',
    '',
    'Equipe ClassiHere',
  ].join('\n');

  const html = mailLayoutTemplate({
    title: subject,

    previewText: 'Confirme seu endereço de e-mail no ClassiHere.',

    eyebrow: 'Confirmação de identidade',

    heading: 'Confirme seu endereço de e-mail',

    greetingName: userName,

    paragraphs: [
      'Confirme seu e-mail para concluir a configuração da sua conta no ClassiHere.',
      'Essa confirmação ajuda a manter sua conta protegida e garante que você possa recuperar o acesso quando necessário.',
    ],

    actionLabel: 'Confirmar meu e-mail',

    actionUrl: verificationLink,

    noticeHtml: `
      Este link é válido por
      <strong>${safeExpiresInHours} horas</strong>
      e pode ser utilizado apenas uma vez.
    `,

    securityHtml: `
      Caso você não tenha criado uma conta no
      ClassiHere, ignore esta mensagem.
    `,
  });

  return {
    subject,
    html,
    text,
  };
}

module.exports = verifyEmailTemplate;
