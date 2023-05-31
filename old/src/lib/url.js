const generate = require('nanoid/generate');

const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

async function generateKey() {
  return generate(ALPHABET, 10);
}

module.exports = {
  generateKey,
};
