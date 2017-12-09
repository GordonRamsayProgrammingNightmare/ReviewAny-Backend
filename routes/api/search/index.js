const router = require('express').Router();
const controller = require('./search.controller');

router.get('/tag/:tag', controller.searchByTag);
router.get('/title/:title', controller.searchByTitle);
router.get('/content/:content', controller.searchByContent);
router.get('/image/:imageTag', controller.searchByImage);

module.exports = router;
