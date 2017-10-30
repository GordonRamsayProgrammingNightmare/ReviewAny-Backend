const router = require('express').Router();
const auth = require('./auth');
const post = require('./post');
const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);
router.use('/post', authMiddleware);
router.use('/post', post);

module.exports = router;
