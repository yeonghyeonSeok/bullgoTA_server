var express = require('express');
var router = express.Router();

/* GET home page. */

router.use("/list", require("./list/index"));

module.exports = router;