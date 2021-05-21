const faker = require('faker');

const PetModel = require('../models/Pets');
const ShelterModel = require('../models/Shelter');

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const randomArray = (array) => array[Math.floor(Math.random() * array.length)];

const randomAge = ['3 Months', '8 Years', '7 Years', '1 Year', '8 Months'];
const randomImages = [
  'https://www.thesprucepets.com/thmb/COdGzNriu8oQVi8igXmSzFzXTRk=/2109x2109/smart/filters:no_upscale()/puppy-samoyed-boy-990077480-5c89719646e0fb00012c67e8.jpg',
  'https://media-be.chewy.com/wp-content/uploads/2020/03/28104151/when-can-you-take-a-puppy-home-1330x711.jpg',
  'https://r4x8d8k3.rocketcdn.me/wp-content/uploads/2020/05/hannah-grace-fk4tiMlDFF0-unsplash-1200x800.jpg',
  'https://st2.depositphotos.com/2151793/7534/i/950/depositphotos_75345169-stock-photo-black-and-white-dog-on.jpg',
  'https://images.theconversation.com/files/319652/original/file-20200310-61148-vllmgm.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=754&fit=clip',
  'https://pbs.twimg.com/profile_images/1351720980972933122/I3MnYUdm_400x400.jpg',
  'https://www.angioi.com/assets/images/doge.jpg'
];
const randomAvailability = ['Available', 'Adopted'];
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
  const shelters = await ShelterModel.find({});
  const randomShelter = randomArray(shelters);
  const getId = randomShelter.get('_id');

  for (let i = 0; i < rowsCount; i++) {
    const {
      name: { firstName },
      lorem: { paragraph },
      date: { past }
    } = faker;

    const name = firstName();
    const age = randomArray(randomAge);
    const weight = randomNumber(1, 80);
    const img = randomArray(randomImages);
    const breed = randomArray(randomBreed);
    const dateArrivalInShelter = past();
    const about = paragraph();
    const status = randomArray(randomAvailability);

    pets.push(
      new PetModel({
        name,
        age,
        weight,
        img,
        breed,
        dateArrivalInShelter,
        about,
        status,
        shelterId: getId
      })
    );
  }

  await PetModel.insertMany(pets);

  console.info('> pets created!');

  const shelterPromises = shelters
    .map((shelter) => {
      const petMin = randomNumber(0, 49);
      const petMax = randomNumber(50, 99);
      const randomPets = pets.slice(petMin, petMax);

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
