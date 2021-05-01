require('dotenv').config();
require('../src/configs/db');

const { dropUsers } = require('./users');

(async () => {
  try {
    await dropUsers();
  } catch (error) {
    console.info('> error: ', error);
  }
})();
