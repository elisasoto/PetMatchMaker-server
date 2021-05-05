const router = require('express').Router();
const omitBy = require('lodash/omitBy');

const UserModel = require('../../models/Users');
const PetsModel = require('../../models/Pets');

const { isAuthenticated } = require('../middlewares/authentication');

router.get('/profile', [isAuthenticated], async (req, res, next) => {
  console.log(req.user);

  try {
    const result = await UserModel.findById(req.user);

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

    // si el array de likes esta vacio, regresar todos los pets sin filtrar

    const { likes, deslikes, size, ageOfDog } = user;

    console.log(user, size, ageOfDog);

    /*@TODO: Revisar funcion con christian para ver si hay una manera mas optima de paginar sin tener que requerir dos veces el modelo pet
    esta funcion tambien deberia checar los criterios del usuario y buscar los pets de acuerdo a size y age
    */
    const totalPets = await PetsModel.find({});
    const totalPages = Math.floor(totalPets.length / perPage);

    const result = await PetsModel.find({});
    //.skip(perPage * page - perPage)
    //.limit(perPage);

    const filteredPets = result.filter(
      (pet) => !likes.includes(pet._id) && !deslikes.includes(pet._id)
    );

    const nextPage = page < totalPages ? `?page=${Number(page) + 1}` : null;

    res.status(200).json({
      success: true,
      perPage: filteredPets.length,
      nextPage: nextPage,
      data: filteredPets
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

router.get('/myLikes', [isAuthenticated], async (req, res, next) => {
  try {
    if (req.user.likes) {
      const error = new Error('No favs addd yet');
      error.code = 404;
      throw error;
    }

    const user = await UserModel.findById(req.user).populate({
      path: 'likes',
      model: 'Pets',
      select: {
        name: 1,
        age: 1,
        ageMonthYear: 1,
        weight: 1,
        img: 1,
        breed: 1,
        dateArrivalInShelter: 1,
        about: 1,
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
    const singlePet = await PetsModel.findById({ _id: petId }).populate({
      path: 'shelterId',
      select: {
        name: 1,
        country: 1,
        city: 1
      }
    });

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

    await PetsModel.findOneAndUpdate(
      { _id: petId },
      { $push: { likes: req.user } },
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
