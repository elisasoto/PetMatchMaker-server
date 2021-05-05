const faker = require('faker');

const PetModel = require('../models/Pets');
const ShelterModel = require('../models/Shelter');

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const randomArray = (array) => array[Math.floor(Math.random() * array.length)];

const randomMonthYear = ['Month', 'Year'];
const randomBreed = [
  'Collie',
  'Podenco',
  'Breton',
  'Mestizo',
  'German Sheperd',
  'Akbash',
  'Husky',
  'Golden Retriever',
  'Basset Hound'
];

const createPets = async (rowsCount) => {
  const pets = [];

  for (let i = 0; i < rowsCount; i++) {
    const {
      name: { firstName },
      lorem: { paragraph },
      image: { animals },
      date: { past }
    } = faker;

    const name = firstName();
    const age = randomNumber(1, 20).toString();
    const ageMonthYear = randomArray(randomMonthYear);
    const weight = randomNumber(1, 80).toString();
    const img = animals();
    const breed = randomArray(randomBreed);
    const dateArrivalInShelter = past();
    const about = paragraph();

    pets.push(
      new PetModel({
        name,
        age,
        ageMonthYear,
        weight,
        img,
        breed,
        dateArrivalInShelter,
        about
      })
    );
  }

  await PetModel.insertMany(pets);

  console.info('> pets created!');

  const shelters = await ShelterModel.find({});
  let prevIndex = 0;

  const shelterPromises = shelters
    .map((shelter) => {
      const petAmount = randomNumber(1, 8);
      const randomPets = pets.slice(prevIndex, petAmount);

      return ShelterModel.findByIdAndUpdate(shelter._id, {
        pets: randomPets
      });
    })
    .filter(Boolean);

  await Promise.all(shelterPromises);
  console.info('> shelters updated!');
};

const dropPets = async () => {
  await PetModel.deleteMany({});

  console.info('> pets collection deleted!');
};

module.exports = {
  createPets,
  dropPets
};
