/**
 * Created by zjp on 16/8/4.
 */

import base from './base';
import orgService from '../../../service/hms/organizations/organization'
import CONST from '../../../utils/common'
import orgConst from '../../../utils/const/organization_const'

export default class extends base {
    
    async put() {

        let id = this.req.params.id;
        let data = this.req.body;
        let res = CONST.getSuccess();
        let roleType = this.req.session.user.roleType;
        if (id && data.hasOwnProperty('isEnable')) {
            try{
                res.data = await orgService.switchEnableStatus(id, roleType, data);
            }catch(err){
                res = CONST.getFail();
                res.error.message = err.message;
            }
        }else {
            res = CONST.getFail();
            res.error.message = orgConst.PARAM_ERR;
        }
        this.json(res);

    }
        
    
    
};