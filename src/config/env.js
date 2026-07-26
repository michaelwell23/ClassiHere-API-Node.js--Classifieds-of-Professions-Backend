require('dotenv').config();

function getString(name, fallback = undefined) {
  const value = process.env[name];

  if (value === undefined || value === '') {
    return fallback;
  }
  return value;
}

function getRequiredString(name) {
  const value = getString(name);
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

function getPositiveInteger(name, fallback) {
  const value = getString(name);
  if (value === undefined) {
    return fallback;
  }
  const parsedValue = Number.parseInt(value, 10);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsedValue;
}

function getBoolean(name, fallback = false) {
  const value = getString(name);
  if (value === undefined) {
    return fallback;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  throw new Error(`${name} must be either true or false`);
}

module.exports = {
  getString,
  getRequiredString,
  getPositiveInteger,
  getBoolean,
};
