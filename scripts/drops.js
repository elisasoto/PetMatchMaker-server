require('dotenv').config();
require('../src/configs/db');

const { dropUsers } = require('./users');
const { dropPets } = require('./pets');
const { dropShelters } = require('./shelter');

(async () => {
  try {
    // await dropUsers();
    await dropPets();
    //await dropShelters();
  } catch (error) {
    console.info('> error: ', error);
  }
})();
