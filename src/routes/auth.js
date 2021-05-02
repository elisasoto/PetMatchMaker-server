const router = require('express').Router();
const passport = require('passport');

const getUserResponseData = (user) => ({
  name: user.name,
  surname: user.surname,
  email: user.email
});

router.post('/register/user', (req, res, next) => {
  passport.authenticate('register', (err, user) => {
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
  passport.authenticate('login', (err, user) => {
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
