/**
 * Created by zjp on 16/7/12.
 */

import base from './base';
import importQes from '../../../service/hms/import_excel';
import quesService from  '../../../service/hms/questions';
import CONST from '../../../utils/common';


export  default class extends base {

    async post() {
        let res = CONST.getSuccess();
        let data = {};
        try{
            data = importQes.sheetToJSON(this.req.files.file.path, '导入内容');
        }catch(err){
            res = CONST.getFail();
            res.error.message = err.message;
        }
        let questions = await importQes.convertToQuestions(data);
        res.data = await quesService.addQuestions(questions);
        this.json(res);
    }
}