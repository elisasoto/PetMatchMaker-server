const faker = require('faker');

const PetModel = require('../models/Pets');
const ShelterModel = require('../models/Shelter');

const petCount = process.env.PETS_ROWS || 20;

const rnd = Math.floor(Math.random() * petCount);

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

const createPets = async (rowsCount, seed) => {
  const shelters = await ShelterModel.find({});
  for (const shelter of shelters) {
    const id = shelter.get('_id');

    const entries = Array.from({ length: rowsCount }, (_, i) => i);

    const pets = [];

    for (const entry of entries) {
      seed && faker.seed(seed + entry);

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

      if (entry === rnd) {
        console.log('> Dummy pet created!');
      }

      pets.push(
        new PetModel({
          name,
          age,
          ageMonthYear,
          weight,
          img,
          breed,
          dateArrivalInShelter,
          about,
          shelterId: id
        })
      );
    }

    await PetModel.insertMany(pets);

    console.info('> pets created!');
  }
};

const dropPets = async () => {
  await PetModel.deleteMany({});

  console.info('> pets collection deleted!');
};

module.exports = {
  createPets,
  dropPets
};
