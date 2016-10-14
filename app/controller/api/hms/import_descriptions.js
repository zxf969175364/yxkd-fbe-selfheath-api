/**
 * Created by zjp on 16/7/20.
 */

import base from './base';
import importExcel from '../../../service/hms/import_excel';
import CONST from '../../../utils/common';
import descService from '../../../service/hms/description';


export  default class extends base {

    async post() {
        let res = CONST.getSuccess();
        let data = importExcel.sheetToJSON(this.req.file.path, '疾病评估的名词解释');
        let descriptions = importExcel.convertToDescription(data);
        res.data = await descService.addDescription(descriptions);
        // let questions = await importExcel.convertToQuestions(data);
        // res.data = await quesService.addQuestions(questions);
        this.json(res);
    }

}