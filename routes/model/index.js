var express = require('express');
var router = express.Router();

//모델 정보
router.use("/info", require("./info"));
//대여하기
router.use("/lend", require("./lend"));
//반납하기
router.use("/return", require("./return"));

module.exports = router;