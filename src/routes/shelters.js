const router = require('express').Router();
const omitBy = require('lodash/omitBy');

const ShelterModel = require('../../models/Shelter');
const UsersModel = require('../../models/Users');
const Pet = require('../../models/Pets');

const { isAuthenticated } = require('../middlewares/authentication');

router.get('/adopters', [isAuthenticated], async (req, res, next) => {
  // aqui solo se mostraran en un listado los usuarios que hayan dado swipe right(like) a alguno de los perritos de este shelter
  try {
  } catch (error) {
    next(error);
  }
});

router.get('/profile', [isAuthenticated], async (req, res, next) => {
  try {
    const result = await ShelterModel.findById(req.user, {
      createdAt: 0,
      updatedAt: 0,
      pets: 0,
      __v: 0
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// endpoint to delete one from pets array
// endpoint to modify pet register

router.post('/register/pet', [isAuthenticated], async (req, res, next) => {
  try {
    const newPet = new Pet({
      name: req.body.name,
      age: Number(req.body.age),
      ageMonthYear: req.body.ageMonthYear,
      weight: Number(req.body.weight),
      img: req.body.img,
      breed: req.body.breed,
      dateArrivalInShelter: req.body.dateArrivalInShelter,
      about: req.body.about,
      status: req.body.status,
      shelterId: req.user
    });

    const shelter = await ShelterModel.findById(req.user);

    // pillar el shelter y meter el id de este pet en su array

    newPet
      .save()
      .then((pet) => {
        res.send('pet saved to database');
      })
      .catch((err) => {
        res.status(400).send('unable to save to database');
      });

    newUser.save();
  } catch (error) {
    next(error);
  }
});

router.put('/edit', [isAuthenticated], async (req, res, next) => {
  try {
    const Shelter = await ShelterModel.findById(req.user);

    if (!Shelter) {
      const error = new Error('Shelter not found');
      error.code = 404;
      throw error;
    }

    const filteredShelter = omitBy(req.body, (value, _) => !value);

    const result = await ShelterModel.findByIdAndUpdate(
      req.user,
      filteredShelter,
      {
        new: true
      }
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
