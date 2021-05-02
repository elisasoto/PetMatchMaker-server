const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require('../middlewares/authentication');

const getUserResponseData = (user) => ({
  name: user.name,
  surname: user.surname,
  email: user.email
});

router.get('/userShortProfile', [isAuthenticated], (req, res) => {
  res.status(200).json({
    data: req.user || process.env.DUMMY_USER,
    success: true
  });
});

router.post('/register/user', (req, res, next) => {
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

router.post('/register/shelter', (req, res, next) => {
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
