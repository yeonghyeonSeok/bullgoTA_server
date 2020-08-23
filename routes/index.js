var express = require('express');
var router = express.Router();

/* GET home page. */

router.use("/list", require("./list/index"));
router.use("/product", require("./product/index"));
router.use("/notification", require("./notification/index"));

module.exports = router;