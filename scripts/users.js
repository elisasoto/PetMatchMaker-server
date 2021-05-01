const faker = require('faker');
const bcrypt = require('bcrypt');

const UserModel = require('../models/Users');

const userCount = process.env.USERS_ROWS || 50;

const formatNonDigits = (string) => Number(string.replace(/\D/g, ''));
const randomArray = (array) => array[Math.floor(Math.random() * array.length)];

const randomAge = Math.floor(Math.random() * 80) + 21;
const randomLiving = [
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
const randomAgeDog = [
  'less tha a year',
  '1-3 years',
  '4-6 years',
  'over 6 years',
  'any'
];
const randomBoolean = [true, false];
const randomHours = ['2', '3', '4'];
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
      lorem: { paragraph },
      image: { animals },
      address: { city, country },
      internet: { email, password },
      phone: { phoneNumber },
      datatype: { boolean }
    } = faker;
    const name = firstName();
    const surname = lastName();
    const age = randomAge.toString();
    const living = randomArray(randomLiving);
    const img = animals();
    const userCity = city();
    const userCountry = country();
    const userEmail = email();
    const pswd = password();
    const hash = bcrypt.hashSync(pswd, 10);
    const phone = formatNonDigits(phoneNumber());
    const about = paragraph();
    const motivations = paragraph();
    const hoursToSpend = randomArray(randomHours);
    const size = randomArray(randomSize);
    const ageOfDog = randomArray(randomAgeDog);
    const houseType = randomArray(randomHouseType);
    const petLivingArrangement = randomArray(randomPetLivingArrangement);
    const ammenities = paragraph();
    const otherPets = boolean();
    const firstPet = boolean();

    if (entry === rnd) {
      console.log(
        `> Dummy user created! Use these values to login: ${JSON.stringify({
          email: userEmail,
          password: pswd
        })}`
      );
    }

    users.push(
      new UserModel({
        name,
        surname,
        age,
        living,
        img,
        city: userCity,
        country: userCountry,
        email: userEmail,
        password: hash,
        phone,
        about,
        motivations,
        hoursToSpend,
        size,
        ageOfDog,
        houseType,
        petLivingArrangement,
        ammenities,
        otherPets,
        firstPet
      })
    );
  }

  await UserModel.insertMany(users);

  console.info('> users created!');
};

const dropUsers = async () => {
  await UserModel.deleteMany({});

  console.info('> users collection deleted!');
};

module.exports = {
  createUsers,
  dropUsers
};
