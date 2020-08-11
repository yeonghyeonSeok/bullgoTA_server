var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');

const jwtUtils = require('../../module/jwt');

/*
마커 추가
METHOD       : POST
URL          : /list/marker
BODY         : model = 모델명
               battery = 잔여 배터리
               time = 사용 가능한 시간
               latitude = 위도
               longitude = 경도
*/

router.post('/', async (req, res) => {
    const insertMarkerQuery = 'INSERT INTO marker (model, battery, time, latitude, longitude) VALUES (?, ?, ?, ?, ?)'
    const insertMarkerResult = await db.queryParam_Arr(insertMarkerQuery, [req.body.model, req.body.battery, req.body.time, req.body.latitude, req.body.longitude]);

    if(!insertMarkerResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_INSERT_MARKER));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_MARKER));
    }
});

/*
마커 조회
METHOD       : GET
URL          : /list/marker
*/
router.get('/', async (req, res) => {
    const selectMarkerQuery = 'SELECT * FROM marker'
    const selectMarkerResult = await db.queryParam_None(selectMarkerQuery);
    if(!selectMarkerResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_SELECT_MARKER));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT_MARKER, selectMarkerResult));
    }
});

module.exports = router;