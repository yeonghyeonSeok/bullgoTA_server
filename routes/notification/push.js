var express = require('express');
var router = express.Router();
var FCM = require('fcm-push');
var fcmInfo = require("../../config/fcm_serverkey.json");

const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
푸시알림(타이머)
METHOD       : POST
URL          : /notification/push
BODY         : deviceToken = 디바이스 토큰
               timer = 타이머
*/

router.post('/', async (req, res) => {
    const insertPushQuery = 'INSERT INTO notification (deviceToken, timer) VALUES (?, ?)';
    const insertPushResult = await db.queryParam_Arr(insertPushQuery, [req.body.deviceToken, req.body.timer]);

    var serverKey = fcmInfo.fcmServerKey;
    var fcm = new FCM(serverKey);

    var message = {
        to: 'e6p7y2cgQCeRXxbZfyb0Hr:APA91bF7BnA6B6nUBCtbZjnSIxBLs3RuyG7a6Pm8S383wTXE4fAFJ-rxqcS6F42vh81tcIw5DYoz4rFnRvB6eBKSqxYI9iY5exhbbFcbGYwLp3GE7lTvd-10h4w-TlnW0J9vv8psdu8J',
        priority: 'high',
        data: {
            title: "first notification",
            message: "bulgota first"
        }
    };

    

    if (!insertPushResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_INSERT_PUSH));
    } else {
        const timeout = setTimeout(() => {
            fcm.send(message)
            .then(function(response) {
                console.log('보내기 성공:' + response);
            })
            .catch(function(error) {
                console.log('보내기 실패:' + error);
            });
        },10000)
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_PUSH));
    }
});

module.exports = router;