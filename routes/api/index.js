const router = require('express').Router();
const auth = require('./auth');
const post = require('./post');
const search = require('./search');
const user = require('./user');
const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);
router.use('/post', authMiddleware);
router.use('/post', post);
router.use('/search', authMiddleware);
router.use('/search', search);
router.use('/user', authMiddleware);
router.use('/user', user);

module.exports = router;
