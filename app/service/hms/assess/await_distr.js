/**
 * Created by hgs on 16/7/22.
 *
 * 带分配service
 */

import batchService from '../../../service/hms/assess/batch'
import orgService from '../../../service/hms/organizations/organization'
import capaciytService from '../../../service/hms/assess/capacity'

import orgConst from '../../../utils/const/organization_const'
import batchConst from '../../../utils/const/batch_const'
import extraTools from '../../../utils/tools'


export default {


    findAwaitDistr: async function (map, paginates, orderby) {
        'use strict';
        //批次查詢
        let result = {};

        let batchData = await batchService.findNotDistr(map, paginates, orderby);
        let orgQ = {};
        orgQ.id = map.centerId;
        let orgData = await orgService.findOne(orgQ);



        if (batchData) {
            result.batch = batchData;
        } else {
            throw new Error(batchConst.BATCT.NO_BATCH);
        }

        if (orgData) {
            let org = {};
            result.org = org;
            result.org.checkAreas = orgData.checkAreas;
            result.org.workWeek = orgData.workWeek;
            result.org.expelDate = orgData.expelDate;
        } else {
            throw new Error(orgConst.NO_CHECKAREA);
        }

        return result;



        // rs.data.items = data
        // let batchresult = [];
        //  let result =[];
        //   let range = [];
        //    _.forEach(data, (name) => {
        //        range.push(name.id);
        //        batchresult.push({
        //            batchName: name.batchName,
        //           totalCard: name.totalCard,
        //           checkStartDate: name.checkStartDate,
        //           checkEndDate: name.checkEndDate
        //       })
        //   });
        //组织查询  查出科室的体检区
        //   let orgQ = {};
        //   orgQ.id = map.centerId;
        //   let orgData = await orgService.findOne(orgQ);
        //    if (orgData){
        //        result

        //   console.log(orgData)
        //   if (orgData) {
        //       _.forEach(orgData.checkAreas, (name) => {
        //           _.forEach(result, (result1) => {
        //               result1[name.checkAreaName] = '0';
        //           })
        //        });
        //分配容量查询
        //let capaData = capaciytService.findGroupByArea(range);
        // if (capaData) {
        //     _.forEach(capaData,(capa1)=>{
        // result2[capa1.checkArea]
        //     })
        // })
        //       console.log(result)
        //        return result;
        //    } else {
        //        throw new Error(orgConst.NO_CHECKAREA);
        //     }
        // } else {
        //    throw new Error(batchConst.BATCT.NO_BATCH);

        // }



        //   let querys={};
        //    querys.centerId = this.req.params.id;
        //     querys.day = this.req.params.day || "7";
        //    console.log(querys.centerId);
        //    let orderData = await cardService.groupByOrderSum(querys);
        //    let capacityData = await capacityService.findWithGroupBy(querys);
        //    console.log(orderData);
        //     console.log(capacityData);

    }
}