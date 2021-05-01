require('dotenv').config();
require('../src/configs/db');

const { dropUsers } = require('./users');
const { dropShelters } = require('./shelter');
const { dropPets } = require('./pets');

(async () => {
  try {
    await dropUsers();
    await dropShelters();
    await dropPets();
  } catch (error) {
    console.info('> error: ', error);
  }
})();
