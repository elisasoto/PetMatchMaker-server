require('dotenv').config();
require('../src/configs/db');

const { createUsers } = require('./users');
const { createPets } = require('./pets');
const { createShelters } = require('./shelter');

const DEFAULT_ROWS = 5;
const SEED = 123;

(async () => {
  const { USERS_ROWS, PETS_ROWS, SHELTER_ROWS } = process.env;

  // eslint-disable-next-line no-unused-vars
  const [_, __, flag] = process.argv;

  const argsOpts = {
    randomness: SEED
  };

  try {
    await createUsers(USERS_ROWS || DEFAULT_ROWS, argsOpts[flag]);
    await createPets(PETS_ROWS || DEFAULT_ROWS, argsOpts[flag]);
    await createShelters(SHELTER_ROWS || DEFAULT_ROWS, argsOpts[flag]);
  } catch (error) {
    console.error(error);
  }
})();
