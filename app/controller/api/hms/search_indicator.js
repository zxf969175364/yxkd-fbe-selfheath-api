/*
 * @Author: hgs 
 * @Date: 2016-09-19 13:42:16 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-09-19 15:16:10
 * 指标搜索
 */

import base from './base'
import indicatorService from '../../../service/hms/package/package_indicator'
import commonConst from '../../../utils/common'



export default class extends base {


    async get() {
        let data = [];
        let map = this.req.query || {};
        let rs = commonConst.getSuccess();

        // rs.data = commonConst.getResData();
        try {
            if (map.search) {
                let searchQuery = {
                    or: [{
                        categoryName: { contains: map.search }
                    }, {
                            itemName: { contains: map.search }
                        }, {
                            name: { contains: map.search }
                        }]
                }

                delete map.search;

            }
            // map.centerId = 'SYSTEM';
            rs.data = await indicatorService.searchAndGroup(map);

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }

        this.json(rs)



    }




}