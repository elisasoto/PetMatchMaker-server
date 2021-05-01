const faker = require('faker');
const bcrypt = require('bcrypt');

const UserModel = require('../models/Users');

const userCount = process.env.USERS_ROWS || 50;

const formatNonDigits = (string) => Number(string.replace(/\D/g, ''));

const randomAge = Math.floor(Math.random() * 20) + 1;
const randomLinving = [
  'with parents',
  'with partner and children',
  'with partner only',
  'with roomate',
  'alone'
];
const randomSize = [
  'Medium: 10-20kg',
  'Small: less than 10kg',
  'Big: 20-40kg',
  'X-Large: over 40kg',
  'any'
];
const randomAge = [
  'less tha a year',
  '1-3 years',
  '4-6 years',
  'over 6 years',
  'any'
];
const randomHouseType = ['apartament', 'chalet', 'house with yard'];
const randomPetLivingArrangement = ['inside house', 'outside house'];

const rnd = Math.floor(Math.random() * userCount);

const createUsers = async (rowsCount, seed) => {
  const entries = Array.from({ length: rowsCount }, (_, i) => i);

  const users = [];

  for (const entry of entries) {
    seed && faker.seed(seed + entry);

    const {
      name: { firstName, lastName },
      lorem: { word, paragraph },
      image: { animals },
      address: { city, country },
      internet: { email, password },
      phone: { phoneNumber },
      datatype: { boolean }
    } = faker;
    const name = firstName();
    const surname = lastName();
    const age = randomAge;
    const living = Math.floor(Math.random() * randomLinving.length);
    const img = animals();
    const city = city();
    const country = country();
    const email = email();
    const password = password();
    const hash = bcrypt.hashSync(password, 10);
    const phone = formatNonDigits(phoneNumber());
    const about = paragraph();
    const motivations = paragraph();
    const hoursToSpend = word();
    const size = Math.floor(Math.random() * randomSize.length);
    const ageOfDog = Math.floor(Math.random() * randomAge.length);
    const houseType = Math.floor(Math.random() * randomHouseType.length);
    const petLivingArrangement = Math.floor(
      Math.random() * randomPetLivingArrangement.length
    );
    const ammenities = paragraph();
    const otherPets = boolean();
    const firstPet = boolean();

    if (entry === rnd) {
      console.log(
        `> Dummy user created! Use these values to login: ${JSON.stringify({
          email: mail,
          password: pswd
        })}`
      );
    }

    users.push(new UserModel({
        name, 
        surname, 
        age, 
        living, 
        img, 
        city, 
        country, 
        email,
        password, 
        hash = bcrypt.hashSync(password, 10),
        phone, 
        about, 
        motivations, 
        hoursToSpend, 
        size, 
        ageOfDog, 
        houseType,
        petLivingArrangement, 
        ammenities, 
        otherPets: true, 
        firstPet: true
    }));
  }

  await UserModel.insertMany(users);

  console.info('> users inserted!');
};

const dropUsers = async () => {
  await UserModel.deleteMany({});

  console.info('> users collection deleted!');
};

module.exports = {
  createUsers,
  dropUsers
};
