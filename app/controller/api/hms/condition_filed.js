/*
 * @Author: hgs 
 * @Date: 2016-09-14 10:39:41 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-09-14 11:40:16
 */
import base from './base'
import conditionService from '../../../service/hms/system/condition_filed'
import commonConst from '../../../utils/common'

export default class extends base {

    async get() {
        let data = [];
        let map = this.req.query || {};
        let rs = commonConst.getSuccess();
        // rs.data = commonConst.getResData();
        try {
            data = await conditionService.find(map)
            rs.items = data
        } catch (error) {

        }

        this.json(rs)
    }

}