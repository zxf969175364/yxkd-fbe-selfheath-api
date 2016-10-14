/**
 * Created by hgs on 16/8/19.
 *
 */

import base from './base'
import smsService from '../../../service/hms/sms'

import commonConst from '../../../utils/common';



export default class extends base {

    //批量发送短信
    async post() {
        let data = this.req.body;
        let rs = commonConst.getSuccess();
        try {
            // let result = await batchService.create(data);
            let result = await smsService.sendCardsSMS(data, this.req.session)
            console.log(result)
            if (result.res==='SUCCESS') {
                rs.data.successNum = result.successNum;
                
            } else {
                rs = commonConst.getWarning();
                
                rs.error.code = 555;
                rs.error.message = result.data;
                rs.error.successNum = result.successNum;
            }
        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message

        }
        this.json(rs)
    }


}  
