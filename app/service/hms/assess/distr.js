/**
 * Created by hgs on 16/7/22.
 *
 * 带分配service
 */

import batchService from '../../../service/hms/assess/batch'
import orgService from '../../../service/hms/organizations/organization'
import capaciytService from '../../../service/hms/assess/capacity'
import cardtService from '../../../service/hms/assess/card'

import orgConst from '../../../utils/const/organization_const'
import batchConst from '../../../utils/const/batch_const'
import extraTools from '../../../utils/tools'


export default {


    findAwaitDistr: async function (map, paginates, orderby) {
        'use strict';
        //批次查詢
        let result = {};
        map['totalCard'] = { '!': 0 };
        //批次信息
        let batchData = await batchService.findNotDistr(map, paginates, orderby);
        let orgData = await orgService.findOne({ id: map.centerId });
        // let orgQ = {};
        // orgQ.id = map.centerId;
        // //科室信息（体检区）
        // let orgData = await orgService.findOne(orgQ);
        let query = {};
        let batchresult = [];

        let range = [];
        _.forEach(batchData, (name) => {
            range.push(name.id);
            let dd = {
                batchId: name.id,
                batchName: name.batchName,
                totalCard: name.totalCard,
                checkStartDate: name.checkStartDate,
                checkEndDate: name.checkEndDate
            }
            let checkAreas = [];
            _.forEach(orgData.checkAreas, (v) => {
                checkAreas.push({
                    checkArea: v.checkAreaName,
                    count: 0
                })

            })
            dd.checkAreas = checkAreas;

            // _.forEach(orgData.checkAreas, (v) => {
            //     dd[v.checkAreaName] = 0;
            // })


            batchresult.push(dd)
        });

        // query.batchId = range;

        let cardsData = await cardtService.groupByAreaSum(range);

        // _.groupBy(cardsData, (v) => {
        //     return v.checkArea;
        // });
        // console.log(cardsData)

        _.forEach(batchresult, (v) => {
            // console.log(v)
            _.forEach(v.checkAreas, (k) => {
                let area = _.filter(cardsData, (m) => {
                    return (v.batchId === m.batchId && k.checkArea === m.checkArea);
                })
                if (area.length !== 0) {
                    k.count = area[0].count;
                }
            })


            // if (cardsData[v.batchId]) {
            //     _.forEach(cardsData[v.batchId], (k) => {
            //         _.forEach(v.checkAreas, (m) => {
            //             if (k.checkArea === m.checkArea) {
            //                 m.checkArea = k.checkArea;
            //                 m.count = k.count;
            //             }
            //         })
            //     })


            // }

        })

        // _.forEach(batchresult, (v) => {
        //     _.forEach(cardsData, (k) => {
        //         if (v.id === k.batchId) {
        //             v[k.checkArea] = k.count;
        //         }
        //     })
        // })

        if (batchresult) {
            return batchresult;
        } else {
            throw new Error(batchConst.BATCT.NO_BATCH);
        }
    },


    findDistr: async function (map, paginates, orderby) {
        'use strict';
        //批次查詢
        let result = {};
        //批次信息
        let batchData = await batchService.findIsDistr(map, paginates, orderby);
        // let orgQ = {};
        // orgQ.id = map.centerId;
        // //科室信息（体检区）
        // let orgData = await orgService.findOne(orgQ);
        let query = {};
        let batchresult = [];

        let range = [];
        _.forEach(batchData, (name) => {
            range.push(name.id);
            batchresult.push({
                batchId: name.id,
                batchName: name.batchName,
                totalCard: name.totalCard,
                checkStartDate: name.checkStartDate,
                checkEndDate: name.checkEndDate
            })
        });

        // batchresult = _.groupBy(batchresult, (data) => {
        //     return data.batchId
        // })



        // console.log(batchresult)
        //各个体检区分配情况


        query.centerId = map.centerId;
        query.batchId = range;
        let capaData = await capaciytService.findGroupByArea(query, 'capaNum');
        let orderData = await capaciytService.findGroupByArea(query, 'orderNum');


        //合并
        _.mergeWith(capaData, orderData, (a, b) => {
            return _.merge(a, b);
        });


        _.forEach(capaData, (data) => {
            data.residue = data.capaNum - data.orderNum;
        })

        console.log(capaData)

        capaData = _.groupBy(capaData, (data) => {
            return data.batchId
        })



        _.forEach(batchresult, (v) => {
            v.checkAreas = capaData[v.batchId];


        })
        // console.log(capaData);

        // _.merge(batchresult, capaData, (a, b) => {
        //     return _.merge(a, b);
        // })

        //         batchresult = _.groupBy(batchresult, (data) => {
        //     return data.batchId
        // })

        console.log(batchresult);

        // //各个体检区已预约情况
        // let orderNum = await cardtService.groupByOrderTal(query)



        if (batchresult) {
            return batchresult;
        } else {
            throw new Error(batchConst.BATCT.NO_BATCH);
        }

        // if (orgData) {
        //     let org = {};

        //     org.checkAreas = orgData.checkAreas;
        //     org.workWeek = orgData.workWeek;
        //     org.expelDate = orgData.expelDate;
        //     result.org = org;
        // } else {
        //     throw new Error(orgConst.NO_CHECKAREA);
        // }
        // if (capaData) {
        //     result.capa = capaData;
        // }

        // if (orderNum) {
        //     result.orderNum = orderNum;
        // }








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