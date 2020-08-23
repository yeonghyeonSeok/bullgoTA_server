var express = require('express');
var router = express.Router();

//모델
router.use("/model", require("./model"));

module.exports = router;