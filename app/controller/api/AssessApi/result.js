import QService from '../../../service/hms/result'
import cardService from '../../../service/hms/assess/card'
import base from './base'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/result_const'

export default class extends base {

    //获取问卷答案(查询\列表\详情)
    async get() {

        let data = {};
        let map = this.req.query || {};
        let rs = commonConst.getAssessSuccess();
        let format = this.req.query.format;

        if (!map.cardId) {
            rs = commonConst.getAssessFail();
            rs.message = '测评卡ID不可为空';
            this.result(rs, format);
            return;
        }

        data = await QService.findOne({ cardId: map.cardId });

        if (!data) {
            rs = commonConst.getAssessFail();
            rs.message = Const.RESULT.RESULT_NOT_EXIST;
            this.result(rs, format);
            return;
        }

        let card = await cardService.findOne({ id: map.cardId });

        if (!card) {
            rs = commonConst.getAssessFail();
            rs.message = '卡号无效';
            this.result(rs, format);
            return;
        }

        if (card.status !== 'FINISHED') {
            rs = commonConst.getAssessFail();
            rs.message = '该用户未答完题';
            this.result(rs, format);
            return;
        }

        rs.data = data;

        this.result(rs, format);
    }

}