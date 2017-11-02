const router = require('express').Router();
const controller = require('./post.controller');

// Post CRUD
router.post('', controller.makePost);
router.get('/:post_id', controller.getPost);
router.get('', controller.getAllPosts);
router.delete('/:post_id', controller.deletePost);
router.put('/:post_id', controller.updatePost);

module.exports = router;
