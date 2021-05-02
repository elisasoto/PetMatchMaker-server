const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const omitBy = require('lodash/omitBy');

const User = require('../../models/Users');
const Shelter = require('../../models/Shelter');

passport.use(
  'registerUser',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            const hash = bcrypt.hashSync(password, 10);
            const filteredUser = omitBy(req.body, (value, _) => !value);

            const newUser = new User({
              ...filteredUser,
              email,
              password: hash
            });

            newUser
              .save()
              .then(() => done(null, newUser))
              .catch((err) => done(err, null));
          } else {
            throw new Error('User already exists');
          }
        })
        .catch((err) => done(err, null));
    }
  )
);

passport.use(
  'registerShelter',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      Shelter.findOne({ email })
        .then((shelter) => {
          if (!shelter) {
            const hash = bcrypt.hashSync(password, 10);
            const filteredShelter = omitBy(req.body, (value, _) => !value);

            const newShelter = new Shelter({
              ...filteredShelter,
              email,
              password: hash
            });

            newShelter
              .save()
              .then(() => done(null, newShelter))
              .catch((err) => done(err, null));
          } else {
            throw new Error('User already exists');
          }
        })
        .catch((err) => done(err, null));
    }
  )
);

passport.use(
  'loginUser',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // Receive req in case more fields are needed when registering user
    },
    (req, email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          // If there is no user in DB, register it
          if (!user) {
            throw new Error('User does not exist');
          }

          const userPassword = user.get('password');
          const isValidPassword = bcrypt.compareSync(password, userPassword);

          if (!isValidPassword) {
            throw new Error('Incorrect email and password');
          }

          done(null, user);
        })
        .catch((err) => done(err, null));
    }
  )
);

passport.use(
  'loginShelter',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // Receive req in case more fields are needed when registering user
    },
    (req, email, password, done) => {
      Shelter.findOne({ email })
        .then((shelter) => {
          // If there is no shelter in DB, register it
          if (!shelter) {
            throw new Error('User does not exist');
          }

          const shelterPassword = shelter.get('password');
          const isValidPassword = bcrypt.compareSync(password, shelterPassword);

          if (!isValidPassword) {
            throw new Error('Incorrect email and password');
          }

          done(null, shelter);
        })
        .catch((err) => done(err, null));
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const userId = process.env.PREVENT_AUTH ? process.env.DUMMY_USER : id;
  done(null, userId);
});
