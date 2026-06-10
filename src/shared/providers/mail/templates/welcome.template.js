function welcomeTemplate({ firstName }) {
  return `
    <h2>
      Bem-vindo ao ClassiHere
    </h2>

    <p>
      Olá ${firstName},
    </p>

    <p>
      Sua conta foi ativada
      com sucesso.
    </p>
  `;
}

module.exports = welcomeTemplate;
