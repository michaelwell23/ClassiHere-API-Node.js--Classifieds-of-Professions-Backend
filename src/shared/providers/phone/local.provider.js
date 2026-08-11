async function send({ phone, code, expiresAt }) {
  console.log({
    provider: 'local-phone',
    phone,
    code,
    expires_at: expiresAt.toISOString(),
  });

  return {
    accepted: true,
  };
}

module.exports = {
  send,
};
