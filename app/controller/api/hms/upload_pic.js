/**
 * Created by zjp on 16/9/28.
 */


import base from './base';
import CONST from '../../../utils/common';
import path from 'path';

export default class extends base {

    async post() {
        let res = CONST.getSuccess();
        res.data.fileName = path.basename(this.req.files.file.path);
        this.json(res);
    }
}