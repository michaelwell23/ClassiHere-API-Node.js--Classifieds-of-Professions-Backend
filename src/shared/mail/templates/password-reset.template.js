function passwordResetTemplate({ userName, resetId, token }) {
  const resetLink =
    `${process.env.FRONTEND_URL}` + `/reset-password` + `?id=${resetId}` + `&token=${token}`;

  return `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
      "
    >
      <h2>
        Recuperação de Senha
      </h2>

      <p>
        Olá, ${userName}.
      </p>

      <p>
        Recebemos uma solicitação para redefinir sua senha.
      </p>

      <p>
        Clique no botão abaixo:
      </p>

      <a
        href="${resetLink}"
        style="
          display:inline-block;
          padding:12px 24px;
          background:#2563eb;
          color:#ffffff;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Redefinir Senha
      </a>

      <p>
        Este link expira em 1 hora.
      </p>

      <p>
        Caso você não tenha solicitado a redefinição da senha,
        ignore este e-mail.
      </p>
    </div>
  `;
}

module.exports = passwordResetTemplate;
