/**
 * Created by zjp on 16/8/20.
 */


import base from './base';
import CONST from '../../../utils/common';
import importQes from '../../../service/hms/import_excel';
import bsService from '../../../service/hms/rules/basic_score';
import bsConst from '../../../utils/const/basic_score_const';

export default class extends base {

    async post() {

        let res = CONST.getSuccess();
        let data = this.req.body;
        if (!(data.questionnaireId && data.sectionName)) {
            res = CONST.getFail();
            res.error.message = bsConst.NO_NECESSARY_ARG;
        }else {
            let scores;
            try {
                scores = importQes.sheetToJSON(this.req.files.file.path, 'basic');
            } catch (err) {
                res = CONST.getFail();
                res.error.message = err.message;
            }
            let questions = await importQes.convertToBasicScore(scores, data);
            res.data = await bsService.create(questions);
        }
        this.json(res);
    }

}