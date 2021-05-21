const UserModel = require('../../models/Users');
const ShelterModel = require('../../models/Shelter');
const router = require('express').Router();
const passport = require('passport');

const { isAuthenticated } = require('../middlewares/authentication');
const uploader = require('../middlewares/uploader');

const getUserResponseData = (user) => ({
  name: user.name,
  img: user.img
});

router.get('/short-profile', [isAuthenticated], async (req, res, next) => {
  try {
    const result = await UserModel.findById(req.user, {
      img: 1
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/short-profile-shelter',
  [isAuthenticated],
  async (req, res, next) => {
    try {
      const result = await ShelterModel.findById(req.user, {
        name: 1
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/register/user', [uploader.single('img')], (req, res, next) => {
  passport.authenticate('registerUser', (err, user) => {
    if (err) {
      return res.status(402).json({ data: err.message, success: false });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(401).json({ data: loginErr.message, success: false });
      }

      res.status(200).json({
        data: getUserResponseData(user),
        success: true
      });
    });
  })(req, res, next);
});

router.post('/register/shelter', [uploader.single('img')], (req, res, next) => {
  passport.authenticate('registerShelter', (err, user) => {
    if (err) {
      return res.status(402).json({ data: err.message, success: false });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(401).json({ data: loginErr.message, success: false });
      }

      res.status(200).json({
        data: getUserResponseData(user),
        success: true
      });
    });
  })(req, res, next);
});

router.post('/login/user', (req, res, next) => {
  passport.authenticate('loginUser', (err, user) => {
    if (err) {
      return res.status(402).json({ data: err.message, success: false });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(401).json({ data: loginErr.message, success: false });
      }

      res.status(200).json({
        data: getUserResponseData(user),
        success: true
      });
    });
  })(req, res, next);
});

router.post('/login/shelter', (req, res, next) => {
  passport.authenticate('loginShelter', (err, user) => {
    if (err) {
      return res.status(402).json({ data: err.message, success: false });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(401).json({ data: loginErr.message, success: false });
      }

      res.status(200).json({
        data: getUserResponseData(user),
        success: true
      });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();

  delete req.session;
  res.clearCookie('express:sess', { path: '/' });
  res.clearCookie('express:sess.sig', { path: '/' });
  res.status(200).send('Ok.');
});
module.exports = router;
