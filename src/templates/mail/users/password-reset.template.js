function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function passwordResetTemplate({ userName, resetLink, expiresInMinutes }) {
  const safeUserName = escapeHtml(userName || 'usuário');
  const safeResetLink = escapeHtml(resetLink);

  const subject = 'Redefina sua senha do ClassiHere';

  const text = [
    `Olá, ${userName || 'usuário'}.`,
    '',
    'Recebemos uma solicitação para redefinir a senha da sua conta no ClassiHere.',
    '',
    `Acesse o link abaixo para criar uma nova senha:`,
    resetLink,
    '',
    `Este link é válido por ${expiresInMinutes} minutos e só pode ser utilizado uma vez.`,
    '',
    'Caso você não tenha solicitado essa alteração, ignore esta mensagem. Sua senha permanecerá inalterada.',
    '',
    'Equipe ClassiHere',
  ].join('\n');

  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="light">
        <title>${subject}</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f7fb;
          color: #172033;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            width: 100%;
            border-collapse: collapse;
            background-color: #f4f7fb;
          "
        >
          <tr>
            <td align="center" style="padding: 32px 16px;">
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  width: 100%;
                  max-width: 600px;
                  overflow: hidden;
                  border: 1px solid #e3e8f0;
                  border-radius: 16px;
                  background-color: #ffffff;
                  box-shadow: 0 8px 24px rgba(23, 32, 51, 0.06);
                "
              >
                <tr>
                  <td
                    style="
                      padding: 24px 32px;
                      background-color: #172033;
                    "
                  >
                    <div
                      style="
                        color: #ffffff;
                        font-size: 24px;
                        font-weight: 700;
                        letter-spacing: -0.5px;
                      "
                    >
                      ClassiHere
                    </div>

                    <div
                      style="
                        margin-top: 4px;
                        color: #cdd6e5;
                        font-size: 13px;
                      "
                    >
                      Sua conta, protegida.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 36px 32px 16px;">
                    <h1
                      style="
                        margin: 0;
                        color: #172033;
                        font-size: 26px;
                        line-height: 1.3;
                      "
                    >
                      Redefinição de senha
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 0 32px;
                      color: #44506a;
                      font-size: 16px;
                      line-height: 1.65;
                    "
                  >
                    <p style="margin: 0 0 16px;">
                      Olá, <strong>${safeUserName}</strong>.
                    </p>

                    <p style="margin: 0 0 16px;">
                      Recebemos uma solicitação para redefinir a senha
                      associada à sua conta no ClassiHere.
                    </p>

                    <p style="margin: 0;">
                      Use o botão abaixo para criar uma nova senha.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 28px 32px;">
                    <a
                      href="${safeResetLink}"
                      target="_blank"
                      rel="noopener noreferrer"
                      style="
                        display: inline-block;
                        padding: 14px 28px;
                        border-radius: 8px;
                        background-color: #2563eb;
                        color: #ffffff;
                        font-size: 16px;
                        font-weight: 700;
                        line-height: 1;
                        text-decoration: none;
                      "
                    >
                      Redefinir minha senha
                    </a>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 0 32px 24px;
                      color: #44506a;
                      font-size: 14px;
                      line-height: 1.6;
                    "
                  >
                    <div
                      style="
                        padding: 16px;
                        border: 1px solid #dbe4f0;
                        border-radius: 8px;
                        background-color: #f8fafc;
                      "
                    >
                      Este link expira em
                      <strong>${expiresInMinutes} minutos</strong>
                      e só pode ser utilizado uma vez.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 0 32px 20px;
                      color: #667085;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    Caso o botão não funcione, copie e cole este endereço
                    no navegador:
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 32px 28px;">
                    <div
                      style="
                        overflow-wrap: anywhere;
                        padding: 12px 14px;
                        border-radius: 6px;
                        background-color: #f1f5f9;
                        color: #2563eb;
                        font-size: 12px;
                        line-height: 1.5;
                      "
                    >
                      ${safeResetLink}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 24px 32px;
                      border-top: 1px solid #e3e8f0;
                      background-color: #fafbfc;
                      color: #667085;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    <strong style="color: #44506a;">
                      Você não solicitou essa alteração?
                    </strong>

                    <br>

                    Ignore este e-mail. Sua senha continuará a mesma.
                    Por segurança, não compartilhe este link com ninguém.
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      padding: 22px 32px;
                      color: #98a2b3;
                      font-size: 12px;
                      line-height: 1.5;
                    "
                  >
                    Esta é uma mensagem automática do ClassiHere.
                    Não responda a este e-mail.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return {
    subject,
    html,
    text,
  };
}

module.exports = passwordResetTemplate;
