const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/shelters', require('./shelters'));
router.use('/pets', require('./pets'));

module.exports = router;
