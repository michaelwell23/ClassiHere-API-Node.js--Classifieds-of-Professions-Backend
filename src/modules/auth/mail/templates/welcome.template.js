const escapeHtml = require('../../../../templates/mail/components/escape-html');

function welcomeTemplate({ userName }) {
  const safeUserName = escapeHtml(userName || 'usuário');

  const subject = 'Bem-vindo ao ClassiHere';

  const text = [
    `Olá, ${userName || 'usuário'}.`,
    '',
    'Seu endereço de e-mail foi confirmado com sucesso.',
    '',
    'Sua conta no ClassiHere está pronta para uso.',
    '',
    'Equipe ClassiHere',
  ].join('\n');

  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        >
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
        <div
          style="
            display: none;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            color: transparent;
          "
        >
          Seu e-mail foi confirmado. Bem-vindo ao ClassiHere.
        </div>

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
            <td
              align="center"
              style="padding: 32px 16px;"
            >
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  width: 100%;
                  max-width: 600px;
                  border: 1px solid #e3e8f0;
                  border-radius: 16px;
                  background-color: #ffffff;
                  box-shadow:
                    0 8px 24px
                    rgba(23, 32, 51, 0.06);
                "
              >
                <tr>
                  <td
                    style="
                      padding: 24px 32px;
                      border-radius: 16px 16px 0 0;
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
                      Sua conta está pronta
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 36px 32px 16px;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #172033;
                        font-size: 26px;
                        line-height: 1.3;
                      "
                    >
                      Bem-vindo ao ClassiHere
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 0 32px 36px;
                      color: #44506a;
                      font-size: 16px;
                      line-height: 1.65;
                    "
                  >
                    <p style="margin: 0 0 16px;">
                      Olá,
                      <strong>${safeUserName}</strong>.
                    </p>

                    <p style="margin: 0 0 16px;">
                      Seu endereço de e-mail foi confirmado
                      com sucesso.
                    </p>

                    <p style="margin: 0;">
                      Sua conta no ClassiHere está pronta
                      para uso.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      padding: 22px 32px;
                      border-top: 1px solid #e3e8f0;
                      color: #98a2b3;
                      font-size: 12px;
                      line-height: 1.5;
                    "
                  >
                    Esta é uma mensagem automática do
                    ClassiHere. Não responda a este e-mail.
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

module.exports = welcomeTemplate;
