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
        to: 'cCzlxjbBTfuq6nfue02V4Q:APA91bEwyM5tuD5e1Oe-M27jAKfaQr6EhCqrFJq7uHR6H3n6evX6UX1Rm8ctkBOKksjqXAoJbZy4Ali0wniqZGKkwnliSRzQ6ea4M4RnWBzihilstr42CaZW28I1oVIEWCSrxNY15o-8',
        priority: 'high',
        data: {
            title: "father",
            message: "Goodnight"
        }
    };

    //var timer = req.body.timer;    

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