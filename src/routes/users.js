const router = require('express').Router();
const omitBy = require('lodash/omitBy');

const UserModel = require('../../models/Users');
const PetsModel = require('../../models/Pets');

const { isAuthenticated } = require('../middlewares/authentication');

router.get('/pets', [isAuthenticated], async (req, res, next) => {
  const perPage = 5;
  const page = req.query.page || 1;

  try {
    const result = await PetsModel.find({})
      .skip(perPage * page - perPage)
      .limit(perPage);

    const nextPage =
      result.length < perPage ? null : `?page=${Number(page) + 1}`;

    res.status(200).json({
      success: true,
      perPage: result.length,
      nextPage: nextPage,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

router.put('/edit', [isAuthenticated], async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user);

    if (!user) {
      const error = new Error('User not found');
      error.code = 404;
      throw error;
    }

    const filteredUser = omitBy(req.body, (value, _) => !value);

    const result = await UserModel.findByIdAndUpdate(req.user, filteredUser, {
      new: true
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

router.put('/deslikes/:petId', [isAuthenticated], async (req, res, next) => {
  const { petId } = req.params;
  try {
    const addDeslikedPet = await UserModel.findOneAndUpdate(
      { _id: req.user },
      { $push: { deslikes: petId } },
      { new: true }
    );
    console.log(addDeslikedPet);

    res.status(200).json({
      success: true,
      data: addDeslikedPet
    });
  } catch (error) {
    next(error);
  }
});

router.put('/likes/:petId', [isAuthenticated], async (req, res, next) => {
  const { petId } = req.params;
  try {
    const addLikedPet = await UserModel.findOneAndUpdate(
      { _id: req.user },
      { $push: { likes: petId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: addLikedPet
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
