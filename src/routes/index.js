const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./auth'));
router.use('/shelters', require('./auth'));
router.use('/pets', require('./auth'));

module.exports = router;
