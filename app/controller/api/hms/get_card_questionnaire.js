/**
 * Created by zjp on 16/7/25.
 */

import base from './base';
import cardService from '../../../service/hms/assess/card';
import quesService from '../../../service/hms/questionnaire';
import CONST from '../../../utils/common';
import cardConst from '../../../utils/const/card_const';
import quesConst from '../../../utils/const/questionnaire_const';


export default class extends base {


    async get() {
        let id = this.req.params.id;
        let res = CONST.getSuccess();
        if (id) {
            let query = {id: id, isDelete: false};
            let data = await cardService.findOne(query);
            let questionnaireInfo = {};
            questionnaireInfo.questionnaireId = data.questionnaireId || "";
            if (!data.finishSection || data.finishSection === "NOT_BEGIN"){
                questionnaireInfo.finishSection = "";
            }else {
                questionnaireInfo.finishSection = data.finishSection;
            }
            if (data.questionnaireId){
                questionnaireInfo.questionnaire = await quesService.findOne({id: data.questionnaireId});
                if (!questionnaireInfo.questionnaire) {
                    res = CONST.getFail();
                    res.error.message = quesConst.QUESTIONNAIRE.QUESTIONNAIRE_NOT_EXIST;
                }
            }
            res.data = questionnaireInfo;
        } else {
            res = CONST.getFail();
            res.error.message = cardConst.ASSESSCARD.NO_CARD_ID;
        }
        this.json(res);

    }

}