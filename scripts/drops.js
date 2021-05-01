require('dotenv').config();
require('../src/configs/db');

const { dropUsers } = require('./users');
const { dropPets } = require('./pets');

(async () => {
  try {
    await dropUsers();
    await dropPets();
  } catch (error) {
    console.info('> error: ', error);
  }
})();
