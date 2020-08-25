var express = require('express');
var router = express.Router();
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
킥보드 반납
METHOD       : PUT
URL          : /model/lend
BODY         : modelNum = {모델번호}
*/
router.put('/', async (req, res) => {
    const selectModelQuery = 'SELECT * FROM model WHERE modelNum = ?'
    const selectModelResult = await db.queryParam_Arr(selectModelQuery, [req.body.modelNum]);
    
    console.log(selectModelResult);
    if(!selectModelResult){  
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));  // DB 에러
    } else{  
        const lendStatus = selectModelResult[0].lendStatus;
        const lendTime = moment(selectModelResult[0].lendTime, 'YYYY-MM-DD HH:mm');
        const returnTime = moment()

        const duration = moment.duration(returnTime.diff(lendTime)).asMinutes();
        const usageTime = Math.floor(duration);

        var data = {
            usageTime: 0     
        }
        data.usageTime = usageTime;

        console.log(usageTime);

        if(lendStatus == 1) {
            const putReturnQuery = 'UPDATE model SET lendStatus = ?, lendTime = ? WHERE modelNum = ?';
            const putReturnResult = await db.queryParam_Arr(putReturnQuery, [0, null, req.body.modelNum]);
            
            if(!putReturnResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_RETURN_MODEL)); // 반납 실패
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_RETURN_MODEL, data));    // 반납 성공
            }
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.ALREADY_RETURN_MODEL));    // 이미 반납된 모델
        }
    }
});

module.exports = router;