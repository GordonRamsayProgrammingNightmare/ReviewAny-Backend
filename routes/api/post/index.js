const router = require('express').Router();
const controller = require('./post.controller');

// Post CRUD

// 포스트를 생성한다.
router.post('', controller.makePost);
// 나의 포스트를 다 보여준다.
router.get('', controller.getMyPost);
// 포스트를 아이디로 검색
router.get('/one/:post_id', controller.getPostById);
// 모든 포스트를 다 보여준다.
router.get('/all', controller.getAllPosts);
// 포스트를 아이디로 삭제한다.
router.delete('/:post_id', controller.deletePost);
// 포스트를 아이디로 업데이트 한다.
router.put('/:post_id', controller.updatePost);

// Post like & View

// 포스트 좋아요를 누른다.
router.post('/like/:post_id', controller.likePost);
// 포스트 좋아요를 취소한다.
router.delete('/like/:post_id', controller.deleteLike);
// 내가 좋아요 누른 포스트를 보여준다.
router.get('/like', controller.getMyLikePost);
// 포스트를 본다.
router.post('/view/:post_id', controller.viewPost);

// Comment CRD

router.post('/comment', controller.commentCreate);
router.delete('/comment/:post_id/:comment_id/:username', controller.commentDelete);

module.exports = router;
