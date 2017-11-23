const router = require('express').Router();
const controller = require('./user.controller');

// User 정보 받기
router.get('/:user_id',controller.getUserById);

// User profileImg 변경
// User saySomething 변경
// User username 변경

module.exports = router;
