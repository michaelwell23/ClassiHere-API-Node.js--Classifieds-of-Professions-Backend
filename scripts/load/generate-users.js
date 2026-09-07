const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const USERS_COUNT = Number(process.env.USERS_COUNT || 10);

const OUTPUT_DIRECTORY = path.resolve(__dirname, 'data');

const OUTPUT_FILE = path.join(OUTPUT_DIRECTORY, 'users.json');

const FIRST_NAMES = [
  'Lucas',
  'Gabriel',
  'Rafael',
  'Matheus',
  'Felipe',
  'Bruno',
  'Daniel',
  'Thiago',
  'Leonardo',
  'Gustavo',
  'Pedro',
  'Henrique',
  'Marcos',
  'André',
  'Diego',
  'Vinicius',
  'Eduardo',
  'Caio',
  'Rodrigo',
  'Fernando',
  'Ana',
  'Mariana',
  'Juliana',
  'Camila',
  'Amanda',
  'Fernanda',
  'Patricia',
  'Carolina',
  'Larissa',
  'Beatriz',
  'Renata',
  'Natalia',
  'Gabriela',
  'Isabela',
  'Leticia',
  'Bianca',
  'Vanessa',
  'Daniela',
  'Priscila',
  'Aline',
  'Tatiane',
  'Bruna',
  'Jéssica',
  'Carla',
  'Sabrina',
  'Monique',
  'Juliana',
  'Camila',
  'Amanda',
  'Fernanda',
  'Patricia',
  'Carolina',
  'Larissa',
  'Beatriz',
  'Renata',
];

const LAST_NAMES = [
  'Silva',
  'Santos',
  'Oliveira',
  'Souza',
  'Pereira',
  'Costa',
  'Rodrigues',
  'Almeida',
  'Nascimento',
  'Lima',
  'Araújo',
  'Fernandes',
  'Carvalho',
  'Gomes',
  'Martins',
  'Rocha',
  'Ribeiro',
  'Alves',
  'Monteiro',
  'Mendes',
  'Lopes',
  'Barbosa',
  'Freitas',
  'Moura',
  'Cardoso',
  'Teixeira',
  'Cavalcanti',
  'Campos',
  'Vieira',
  'Moreira',
  'Farias',
  'Medeiros',
  'Castro',
  'Pinto',
  'Azevedo',
  'Duarte',
  'Cunha',
];

function randomItem(items) {
  return items[crypto.randomInt(0, items.length)];
}

function calculateCpfDigit(digits, factor) {
  let total = 0;

  for (let index = 0; index < digits.length; index += 1) {
    total += Number(digits[index]) * factor;
    factor -= 1;
  }

  const remainder = (total * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

function generateCpf() {
  const baseDigits = [];

  for (let index = 0; index < 9; index += 1) {
    baseDigits.push(crypto.randomInt(0, 10));
  }

  const allEqual = baseDigits.every((digit) => digit === baseDigits[0]);

  if (allEqual) {
    return generateCpf();
  }

  const firstDigit = calculateCpfDigit(baseDigits, 10);
  const secondDigit = calculateCpfDigit([...baseDigits, firstDigit], 11);

  return [...baseDigits, firstDigit, secondDigit].join('');
}

function generateUniqueCpf(usedCpfs) {
  let cpf;

  do {
    cpf = generateCpf();
  } while (usedCpfs.has(cpf));

  usedCpfs.add(cpf);

  return cpf;
}

function generatePhone(index) {
  const subscriberNumber = String(900000000 + index);

  return `11${subscriberNumber}`;
}

function generateEmail(index, runId) {
  const sequence = String(index).padStart(3, '0');
  return ['loadtest', runId, sequence].join('.') + '@example.com';
}

function generateUsers(count) {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('USERS_COUNT must be a positive integer.');
  }

  const usedCpfs = new Set();
  const runId = Date.now().toString(36);
  return Array.from(
    {
      length: count,
    },
    (_, position) => {
      const index = position + 1;

      return {
        first_name: randomItem(FIRST_NAMES),
        last_name: randomItem(LAST_NAMES),
        email: generateEmail(index, runId),
        password: 'LoadTest@123456',
        phone: generatePhone(index),
        cpf: generateUniqueCpf(usedCpfs),
      };
    }
  );
}

function saveUsers(users) {
  fs.mkdirSync(OUTPUT_DIRECTORY, {
    recursive: true,
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function printSummary(users) {
  console.log('');
  console.log('Load test users generated successfully.');
  console.log(`Users: ${users.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log('');
  console.log('First generated user:');
  console.log(JSON.stringify(users[0], null, 2));
}

function main() {
  const users = generateUsers(USERS_COUNT);
  saveUsers(users);
  printSummary(users);
}

main();
