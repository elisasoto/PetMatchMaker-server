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

    res.status(201).json({
      success: true,
      data: 'Shelter Edited'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
