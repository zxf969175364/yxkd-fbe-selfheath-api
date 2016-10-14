import base from './base'
import cardService from '../../../service/hms/assess/card'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/card_const'
import extraTools from  '../../../utils/tools'

export default class extends base {

    //新增
    async post() {
        let data = this.req.body;
        let format = this.req.query.format;
        let rs = commonConst.getAssessSuccess();
        try {
            let count = await cardService.getCardNumber();
            data.cardNumber = extraTools.createCardNumber(8, count);
            data.password = extraTools.createPassword(6);
            let result = await cardService.addCardWithUserInfo(data);
            if (!!result) {
                rs.data = result.cardInfo.id;
            } else {
                rs = commonConst.getAssessFail();
                rs.message = Const.ASSESSCARD.CREATED_FAILED
            }
        } catch (error) {
            rs = commonConst.getAssessFail();
            rs.message = error.message

        }
        this.result(rs, format);
    }

}
