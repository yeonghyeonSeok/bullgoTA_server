var express = require('express');
var router = express.Router();
var moment = require('moment');
require('moment-timezone');
process.env.tz='Asia/Seoul';
//moment.tz.setDefault("Asia/Seoul");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
킥보드 반납
METHOD       : PUT
URL          : /model/lend/:modelNum
PARAMS       : modelNum = {모델번호}
Body         : latitude = {위도}
               longitude = {경도}
*/
router.put('/:modelNum', async (req, res) => {
    const selectModelQuery = 'SELECT * FROM model WHERE modelNum = ?'
    const selectModelResult = await db.queryParam_Arr(selectModelQuery, [req.params.modelNum]);
    
    console.log(selectModelResult);
    if(!selectModelResult){  
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));  // DB 에러
    } else{  
        const lendStatus = selectModelResult[0].lendStatus;
        const lendTime = moment(selectModelResult[0].lendTime);
        const returnTime = moment()
        console.log(returnTime);

        const duration = moment.duration(returnTime.diff(lendTime)).asMinutes();

        const usageTime = Math.floor(duration);

        console.log(usageTime);

        if(lendStatus == 1) {
            const putReturnQuery = 'UPDATE model SET lendStatus = ?, lendTime = ?, latitude = ?, longitude = ? WHERE modelNum = ?';
            const putReturnResult = await db.queryParam_Arr(putReturnQuery, [0, null, req.body.latitude, req.body.longitude, req.params.modelNum]);
            
            if(!putReturnResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_RETURN_MODEL)); // 반납 실패
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_RETURN_MODEL, usageTime));    // 반납 성공
            }
        } else {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_RETURN_MODEL));    // 이미 반납된 모델
        }
    }
});

module.exports = router;