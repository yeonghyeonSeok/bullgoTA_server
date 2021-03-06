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
킥보드 대여
METHOD       : PUT
URL          : /model/lend/:modelNum
PARAMS         : modelNum = {모델번호}
*/
router.put('/:modelNum', async (req, res) => {
    const selectModelQuery = 'SELECT * FROM model WHERE modelNum = ?'
    const selectModelResult = await db.queryParam_Arr(selectModelQuery, [req.params.modelNum]);
    
    console.log(selectModelResult);
    if(!selectModelResult){  
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));  // DB 에러
    } else{  
        const lendStatus = selectModelResult[0].lendStatus;
        const time = moment().format("YYYY-MM-DD HH:mm");

        if(lendStatus == 0) {
            const putLendQuery = 'UPDATE model SET lendStatus = ?, lendTime = ? WHERE modelNum = ?';
            const putLendResult = await db.queryParam_Arr(putLendQuery, [1, time, req.params.modelNum]);

            
            var data = {
                lendTime: '',
                password: ''
            }
            data.lendTime = time;
            data.password = selectModelResult[0].password;
            
            if(!putLendResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_LEND_MODEL)); // 대여 실패
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LEND_MODEL, data));    // 대여 성공
            }
        } else {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_LEND_MODEL));    // 이미 대여중인 모델
        }
    }
});

module.exports = router;