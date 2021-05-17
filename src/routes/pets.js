const router = require('express').Router();
const omitBy = require('lodash/omitBy');

const ShelterModel = require('../../models/Shelter');
const PetsModel = require('../../models/Pets');

const { isAuthenticated } = require('../middlewares/authentication');
const uploader = require('../middlewares/uploader');
const { uploadToCloudinaryPet } = require('../utils/cloudinary');
const { single } = require('../middlewares/uploader');

router.get('/', [isAuthenticated], async (req, res, next) => {
  try {
    const pets = await ShelterModel.findById(req.user, {
      pets: 1,
      _id: 0
    }).populate({
      path: 'pets',
      model: 'Pets',
      select: {
        matches: 0,
        about: 0,
        weight: 0,
        shelterId: 0,
        dateArrivalInShelter: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
      }
    });

    res.status(200).json({
      success: true,
      data: pets
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
        likes: 0,
        deslikes: 0,
        matches: 0,
        password: 0,
        size: 0,
        ageOfDog: 0,
        phone: 0,
        living: 0,
        houseType: 0,
        petLivingArrangement: 0,
        email: 0
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

router.post(
  '/register',
  [isAuthenticated, uploader.single('img')],
  async (req, res, next) => {
    try {
      const file = await uploadToCloudinaryPet(req.file.path);

      const newPet = await new PetsModel({
        name: req.body.name,
        age: req.body.age,
        weight: Number(req.body.weight),
        img: file
          ? file.secure_url
          : 'https://i.pinimg.com/originals/68/1d/82/681d82761579270fb0dd1fdfe08cb424.jpg',
        breed: req.body.breed,
        dateArrivalInShelter: req.body.dateArrivalInShelter,
        about: req.body.about,
        status: req.body.status,
        shelterId: req.user
      });

      await newPet.save();

      await ShelterModel.findByIdAndUpdate(req.user, {
        $push: { pets: newPet }
      });

      res.status(201).json({
        success: true,
        data: 'Pet Created'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/edit/:petId',
  [isAuthenticated, uploader.single('img')],
  async (req, res, next) => {
    const { petId } = req.params;
    const file = await uploadToCloudinaryPet(req.file.path);
    try {
      const Pet = await PetsModel.findById(petId);

      console.log(Pet.dateArrivalInShelter);

      if (!Pet) {
        const error = new Error('Pet not found');
        error.code = 404;
        throw error;
      }

      const filteredPet = omitBy(
        { ...req.body, img: file ? file.secure_url : null },
        (value, _) => !value
      );

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
  }
);

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

router.get('/user/:userId', [isAuthenticated], async (req, res, next) => {
  const { userId } = req.params;
  try {
    const [foundUser] = await PetsModel.find(
      {
        likes: { $in: [userId] }
      },
      { likes: 1 }
    ).populate({
      path: 'likes',
      select: {
        likes: 0,
        deslikes: 0,
        matches: 0,
        _id: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        password: 0
      }
    });

    res.status(201).json({
      success: true,
      data: foundUser.likes[0]
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
      { createdAt: 0, updatedAt: 0, __v: 0, matches: 0, _id: 0 }
    ).populate({
      path: 'shelterId',
      select: {
        name: 1,
        email: 1,
        phone: 1,
        country: 1,
        city: 1,
        _id: 0
      }
    });

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
