var express = require('express');
var router = express.Router();

//푸시알람
router.use("/push", require("./push"));

module.exports = router;