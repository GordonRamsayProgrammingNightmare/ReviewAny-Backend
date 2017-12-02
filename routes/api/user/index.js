const router = require('express').Router();
const controller = require('./user.controller');

// User 정보 받기
router.get('', controller.getUserById);
// User ID로 Username 받기
router.get('/username/:user_id', controller.getUsernameById);
// User profileImg 변경
router.put('/update', controller.updateUserInfo);
// User saySomething 변경
// User username 변경

module.exports = router;
