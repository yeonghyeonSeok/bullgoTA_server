var express = require('express');
var router = express.Router();

//지도 마커
router.use("/marker", require("./marker"));

module.exports = router;