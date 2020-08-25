var express = require('express');
var router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');

const { NULL_VALUE } = require('../../module/utils/responseMessage');

/*
모델 조회
METHOD       : GET
URL          : /model/info/{제품번호}
*/
router.get('/:model', async (req, res) => {
    const selectModelQuery = 'SELECT * FROM model WHERE modelNum = ?'
    const selectModelResult = await db.queryParam_Parse(selectModelQuery, req.params.model);
    console.log(selectModelResult);

    if(!selectModelResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR));
        
    } else {
        if(selectModelResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_EXIST_MODEL));
        }else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.EXIST_MODEL));
        } 
    }
});

module.exports = router;