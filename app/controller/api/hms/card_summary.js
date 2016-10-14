/**
 * Created by zjp on 16/8/2.
 */
import base from './base';
import cardService from '../../../service/hms/assess/card'
import cardDao from '../../../dao/hms/assess/card';
import orgService from '../../../service/hms/organizations/organization'
import CONST from '../../../utils/common'
import cardConst from '../../../utils/const/card_const'
import orgConst from '../../../utils/const/organization_const'

export default class extends base {


    /**
     * 参数
     * date:          //时间       查询条件,某天、某月、某年
     * date_range:    //时间范围    可能值:day,month,year
     *
     * orgId:         //组织 ID    查看某组织的测评卡信息。
     * orgType:       //组织类型    AGENCY,HOSPITAL,CENTER
     *
     * ----------------------------------
     * agencyId:       // 代理商 ID
     * hospitalId:      //医院 ID
     * centerId:       //体检中心 ID
     *---------------------------------
     *
     */


    async get(){
        let res = CONST.getSuccess();
        let map = this.req.query;
        if (!map.orgType || map.orgType ==="ADMIN" || map.orgType === "SUADMIN"){
            res.data = await cardService.summaryByMonth(map, this.req.session.user);
            // res = CONST.getFail();
            // res.error.message = cardConst.ASSESSCARD.ARGS_ERR;
        }else if (!map.orgId){
            res.data = await cardService.orgSummary(map, this.req.session.user);
        }else {
            res.data = await cardService.summary(map);
        }
        this.json(res);
    }

}