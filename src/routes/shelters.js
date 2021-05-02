const router = require('express').Router();
const omitBy = require('lodash/omitBy');

const ShelterModel = require('../../models/Shelter');
const UsersModel = require('../../models/Users');

const { isAuthenticated } = require('../middlewares/authentication');

router.get('/adopters', [isAuthenticated], async (req, res, next) => {
  // hay que entrar en perfil de perrito?
  try {
    const result = await UsersModel.find({});

    res.status(200).json({
      success: true,
      count: result.length,
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

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
