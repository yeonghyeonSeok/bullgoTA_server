var express = require('express');
var router = express.Router();
var FCM = require('fcm-push');
var fcmInfo = require("../../config/fcm_serverkey.json");

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

    var deviceToken = req.body.deviceToken;
    var timer = (req.body.timer)*1000; 

    var message = {
        to: deviceToken,
        priority: 'high',
        data: {
            title: "불고타 알람 도착",
            message: "이제 다시 불어보세요!"
        }
    };

    console.log(message.to);

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
        },timer)
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_PUSH));
    }
});

module.exports = router;