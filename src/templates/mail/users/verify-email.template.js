function verifyEmailTemplate({ firstName, verificationUrl }) {
  return `
    <div
      style="
        font-family: Arial;
        max-width: 600px;
        margin: auto;
      "
    >
      <h2>
        Confirme seu e-mail
      </h2>

      <p>
        Olá ${firstName},
      </p>

      <p>
        Obrigado por criar sua conta
        no ClassiHere.
      </p>

      <p>
        Clique no botão abaixo
        para confirmar seu e-mail.
      </p>

      <a
        href="${verificationUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Confirmar e-mail
      </a>

      <p>
        Caso você não tenha criado
        esta conta, ignore este
        e-mail.
      </p>
    </div>
  `;
}

module.exports = verifyEmailTemplate;
