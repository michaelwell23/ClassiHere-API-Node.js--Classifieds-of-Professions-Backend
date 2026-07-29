const escapeHtml = require('./escape-html');

function mailLayoutTemplate({
  title,
  previewText,
  eyebrow,
  heading,
  greetingName,
  paragraphs,
  actionLabel,
  actionUrl,
  noticeHtml,
  securityHtml,
}) {
  const safeTitle = escapeHtml(title);
  const safePreviewText = escapeHtml(previewText || title);
  const safeEyebrow = escapeHtml(eyebrow);
  const safeHeading = escapeHtml(heading);
  const safeGreetingName = escapeHtml(greetingName || 'usuário');
  const safeActionLabel = escapeHtml(actionLabel);
  const safeActionUrl = escapeHtml(actionUrl);

  const paragraphsHtml = paragraphs
    .map(
      (paragraph) => `
        <p style="margin: 0 0 16px;">
          ${paragraph}
        </p>
      `
    )
    .join('');

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        >
        <meta name="color-scheme" content="light">
        <title>${safeTitle}</title>
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
          ${safePreviewText}
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
                      ${safeEyebrow}
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
                      ${safeHeading}
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
                      Olá,
                      <strong>${safeGreetingName}</strong>.
                    </p>

                    ${paragraphsHtml}
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="padding: 12px 32px 28px;"
                  >
                    <a
                      href="${safeActionUrl}"
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
                      ${safeActionLabel}
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
                      ${noticeHtml}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 0 32px 16px;
                      color: #667085;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    Caso o botão não funcione, copie e cole
                    este endereço no navegador:
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
                      ${safeActionUrl}
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
                    ${securityHtml}
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
}

module.exports = mailLayoutTemplate;
