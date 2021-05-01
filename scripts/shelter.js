const faker = require('faker');
const bcrypt = require('bcrypt');

const ShelterModel = require('../models/Shelter');

const shelterCount = process.env.SHELTER_ROWS || 20;

const formatNonDigits = (string) => Number(string.replace(/\D/g, ''));

const rnd = Math.floor(Math.random() * shelterCount);

const createShelters = async (rowsCount, seed) => {
  const entries = Array.from({ length: rowsCount }, (_, i) => i);

  const shelters = [];

  for (const entry of entries) {
    seed && faker.seed(seed + entry);

    const {
      company: { companyName },
      internet: { email, password },
      lorem: { paragraph },
      address: { city, country },
      phone: { phoneNumber },
      datatype: { boolean }
    } = faker;
    const name = companyName();
    const shelterEmail = email();
    const pswd = password();
    const hash = bcrypt.hashSync(pswd, 10);
    const phone = formatNonDigits(phoneNumber());
    const shelterCity = city();
    const shelterCountry = country();
    const about = paragraph();

    if (entry === rnd) {
      console.log(
        `> Dummy shelter created! Use these values to login: ${JSON.stringify({
          email: shelterEmail,
          password: pswd
        })}`
      );
    }

    shelters.push(
      new ShelterModel({
        name,
        email: shelterEmail,
        password: hash,
        phone,
        city: shelterCity,
        country: shelterCountry,
        about
      })
    );
  }

  await ShelterModel.insertMany(shelters);

  console.info('> shelters created!');
};

const dropShelters = async () => {
  await ShelterModel.deleteMany({});

  console.info('> shelters collection deleted!');
};

module.exports = {
  createShelters,
  dropShelters
};
