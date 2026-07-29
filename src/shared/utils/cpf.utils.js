function isValidCPF(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const cpf = value.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;

  for (let index = 0; index < 9; index++) {
    sum += Number(cpf[index]) * (10 - index);
  }

  let firstDigit = (sum * 10) % 11;

  if (firstDigit === 10) {
    firstDigit = 0;
  }

  if (firstDigit !== Number(cpf[9])) {
    return false;
  }

  sum = 0;

  for (let index = 0; index < 10; index++) {
    sum += Number(cpf[index]) * (11 - index);
  }

  let secondDigit = (sum * 10) % 11;

  if (secondDigit === 10) {
    secondDigit = 0;
  }

  return secondDigit === Number(cpf[10]);
}

module.exports = isValidCPF;
