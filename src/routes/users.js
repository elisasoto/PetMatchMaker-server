const router = require('express').Router();
const omitBy = require('lodash/omitBy');

const UserModel = require('../../models/Users');
const PetsModel = require('../../models/Pets');

const { isAuthenticated } = require('../middlewares/authentication');
const uploader = require('../middlewares/uploader');
const { uploadToCloudinaryUser } = require('../utils/cloudinary');

router.get('/profile', [isAuthenticated], async (req, res, next) => {
  try {
    const result = await UserModel.findById(req.user, {
      deslikes: 0,
      matches: 0,
      password: 0,
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

router.get('/pets', [isAuthenticated], async (req, res, next) => {
  const perPage = 5;
  const page = req.query.page || 1;

  try {
    const user = await UserModel.findById({ _id: req.user });

    const { likes, deslikes, size, ageOfDog } = user;

    const weightParams = {
      MEDIUM: { $gte: 11, $lte: 20 },
      SMALL: { $lte: 10 },
      BIG: { $gte: 21, $lte: 40 },
      XXL: { $gte: 41 },
      ANY: { $gte: 1 }
    };

    const ageParams = {
      PUPPY: { $regex: 'MONTH', $options: 'i' },
      ADULT: { $regex: 'YEAR', $options: 'i' },
      ANY: { $regex: '', $options: 'i' }
    };
    const unwantedPets = [...likes, ...deslikes];

    const dbQueryParams = {
      status: 'Available',
      weight: weightParams[size],
      age: ageParams[ageOfDog],
      _id: { $not: { $in: unwantedPets } }
    };

    const result = await PetsModel.find(dbQueryParams, {
      status: 0,
      likes: 0,
      matches: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      about: 0,
      shelterId: 0,
      dateArrivalInShelter: 0
    })
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

router.put(
  '/edit',
  [isAuthenticated, uploader.single('img')],
  async (req, res, next) => {
    let file = null;
    try {
      if (req.file) {
        file = await uploadToCloudinaryPet(req.file.path);
      }
      const user = await UserModel.findById(req.user);

      if (!user) {
        const error = new Error('User not found');
        error.code = 404;
        throw error;
      }

      const filteredUser = omitBy(
        { ...req.body, img: file ? file.secure_url : null },
        (value, _) => !value
      );

      await UserModel.findByIdAndUpdate(req.user, filteredUser, {
        new: true
      });

      res.status(201).json({
        success: true,
        data: 'User Updated'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/myLikes', [isAuthenticated], async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user, { likes: 1 }).populate({
      path: 'likes',
      model: 'Pets',
      select: {
        name: 1,
        age: 1,
        img: 1,
        likes: 1,
        breed: 1,
        status: 1,
        shelterId: 1
      },
      populate: {
        path: 'shelterId',
        select: {
          name: 1,
          email: 1,
          phone: 1,
          city: 1,
          country: 1
        }
      }
    });

    if (user.likes.length === 0 || undefined) {
      throw new Error('No favs added yet');
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

router.get('/pet/:petId', [isAuthenticated], async (req, res, next) => {
  const { petId } = req.params;
  try {
    const singlePet = await PetsModel.findById(
      { _id: petId },
      { matches: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    ).populate({
      path: 'shelterId',
      select: {
        name: 1,
        country: 1,
        city: 1
      }
    });

    if (!singlePet) {
      const error = new Error('Pet not found');
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

router.put('/deslikes/:petId', [isAuthenticated], async (req, res, next) => {
  const { petId } = req.params;
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.user },
      { $push: { deslikes: petId } }
    );

    await UserModel.findOneAndUpdate(
      { _id: req.user },
      { $pull: { likes: petId } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: 'Dislikes Updated'
    });
  } catch (error) {
    next(error);
  }
});

router.put('/likes/:petId', [isAuthenticated], async (req, res, next) => {
  const { petId } = req.params;
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.user },
      { $push: { likes: petId } }
    );

    await PetsModel.findOneAndUpdate(
      { _id: petId },
      { $push: { likes: req.user } }
    );

    res.status(201).json({
      success: true,
      data: 'Likes Updated'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
