const router = require('express').Router();
const omitBy = require('lodash/omitBy');

const ShelterModel = require('../../models/Shelter');
const UsersModel = require('../../models/Users');
const PetsModel = require('../../models/Pets');

const { isAuthenticated } = require('../middlewares/authentication');

router.get('/', [isAuthenticated], async (req, res, next) => {
  try {
    const shelter = await ShelterModel.findById(req.user, {
      pets: 1,
      _id: 0
    }).populate({
      path: 'pets',
      model: 'Pets',
      select: {
        likes: 0,
        matches: 0,
        sheltterId: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
      }
    });

    res.status(200).json({
      success: true,
      data: shelter
    });
  } catch (error) {
    next(error);
  }
});

router.get('/likes/:petId', [isAuthenticated], async (req, res, next) => {
  const { petId } = req.params;
  try {
    const adopters = await PetsModel.findById(petId, { likes: 1 }).populate({
      path: 'likes',
      model: 'Users',
      select: {
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        _id: 0,
        likes: 0,
        deslikes: 0,
        matches: 0,
        password: 0,
        size: 0,
        ageOfDog: 0
      }
    });

    if (!adopters) {
      const error = new Error('Pet Not found');
      error.code = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: adopters
    });
  } catch (error) {
    next(error);
  }
});

router.post('/register', [isAuthenticated], async (req, res, next) => {
  try {
    const newPet = new PetsModel({
      name: req.body.name,
      age: req.body.age,
      weight: Number(req.body.weight),
      img: req.body.img,
      breed: req.body.breed,
      dateArrivalInShelter: req.body.dateArrivalInShelter,
      about: req.body.about,
      status: req.body.status,
      shelterId: req.user
    });

    await newPet.save();

    await ShelterModel.findByIdAndUpdate(req.user, { $push: { pets: newPet } });

    res.status(201).json({
      success: true,
      data: 'Pet Created'
    });
  } catch (error) {
    next(error);
  }
});

router.put('/edit/:petId', [isAuthenticated], async (req, res, next) => {
  const { petId } = req.params;
  try {
    const Pet = await PetsModel.findById(petId);

    if (!Pet) {
      const error = new Error('Pet not found');
      error.code = 404;
      throw error;
    }

    const filteredPet = omitBy(req.body, (value, _) => !value);

    await PetsModel.findByIdAndUpdate(petId, filteredPet, {
      new: true
    });

    res.status(201).json({
      success: true,
      data: 'Pet Edited'
    });
  } catch (error) {
    next(error);
  }
});

router.put('/delete/:petId', [isAuthenticated], async (req, res, next) => {
  const { petId } = req.params;
  try {
    await PetsModel.findByIdAndDelete(petId);

    await ShelterModel.findByIdAndUpdate(req.user, { $pull: { pets: petId } });

    res.status(201).json({
      success: true,
      data: 'Pet Deleted'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:petId', [isAuthenticated], async (req, res, next) => {
  const { petId } = req.params;

  try {
    const singlePet = await PetsModel.findById(
      { _id: petId },
      { shelterId: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    );

    if (!singlePet) {
      const error = new Error('Pet Not found');
      error.code = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: singlePet
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
