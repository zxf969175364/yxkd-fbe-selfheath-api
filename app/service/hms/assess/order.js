/**
 * Created by huangjun on 16/7/25.
 *
 * 预约service
 */

import capacityService from '../../../service/hms/assess/capacity'
import cardService from '../../../service/hms/assess/card'

import capacityDao from '../../../dao/hms/assess/capacity'

import capacityConst from '../../../utils/const/capacity_const'


export default {



    getOrderList: async function (sess) {
        "use strict";
        let result = {};
        let capacityData = [];
        let cardData = [];
        let query;
        // let flag = false;
        // console.log(sess.user.carId)

        let uscard = await cardService.findOne({ id: sess.user.cardId });
        console.error(uscard)
        query = {
            batchId: uscard.batchId,
            checkAreaName: uscard.checkArea
        }

        // capacityData = await capacityService.find(query);





        capacityData = await capacityService.find(query);
        console.log(capacityData)
        _.forEach(capacityData, (data) => {
            data.residue = data.capaNum - data.orderNum;
        })

        console.error(capacityData)
        // capacityData = _.sortBy(capacityData, 'capaDate');

        // cardData = await cardService.sumBybatchTal(query);
        // console.log(capacityData)

        //判断是否已经分配体检区
        if (!!capacityData) {
            let dates = _.sortBy(_.map(_.filter(capacityData, (v) => {
                return v.residue > 0;
            }), 'capaDate'))



            // if (cardData.length !== 0) {
            //     _.forEach(capacityData, (data) => {
            //         let count = _.result(_.find(cardData, { 'checkDate': data.capaDate, 'checkArea': data.checkAreaName }), 'user');
            //         data.capaNum - count;

            //     });
            //     // result.capaData = capacityData;
            // }
            result = dates;





        } else {
            throw new Error(capacityConst.CAPACITY.CAPACITY_NOT_EXIST);
        };

        // result.cardData = cardData;

        return result

    },


    //获取已预约列表 及已分配列表   
    getOrderAndCapa: async function (data) {
        'use strict';


        let capaNum = {
            centerId: data.centerId,
            day: data.day,
            sum: 'capaNum'

        }
        let orderNum = {
            centerId: data.centerId,
            day: data.day,
            sum: 'orderNum'
        }


        let capacityData = await capacityService.findWithGroupBy(capaNum);

        let orderData = await capacityService.findWithGroupBy(orderNum);
        capacityData = _.sortBy(capacityData, 'capaDate');
        orderData = _.sortBy(orderData, 'capaDate');


        _.mergeWith(capacityData, orderData, (a, b) => {
            return _.merge(a, b)

        });



        // console.log(orderData)
        let capas = _.groupBy(capacityData, (data1) => {
            return _.moment(data1.capaDate).format('YYYY-MM-DD').toString();
        })

        // _.sortBy(capas,'c')



        // let allData = _.merge(capas, orders, (a, b) => {
        //     if (_.isArray(a) && _.isArray(b)) {
        //         return _.merge(a, b);
        //     }
        // });
        // let ddd1 = capas;
        // let ddd2 = orders;
        // let allData = _.merge(ddd1, ddd2, function (a, b) {
        //     if (_.isArray(a) && _.isArray(b)) {
        //         return _.merge(a, b);
        //     }
        // });

        // console.log(orders)
        // console.log(allData)





        // let orderData = await cardService.groupByOrderSum(data);












        // _.forEach(capacityData, (v) => {
        //     let temp = _.find(orderData, (k) => {
        //         if (v.capaDate === k.checkDate && v.checkAreaName === k.checkArea) {
        //             return k;
        //         }
        //     })
        //     if (temp) {
        //         v.count = temp.count;
        //         v.residue = v.capaNum - temp.count;
        //     } else {
        //         v.count = 0;
        //         v.residue = v.capaNum;
        //     }
        // });
        // let capas = _.groupBy(capacityData, (item) => {
        //     return _.moment(item.capaDate).format('YYYY-MM-DD')
        // })



        let result = {};
        let date = _.moment().startOf('day').format('YYYY-MM-DD').toString();
        let lastDate = _.findLastKey(capas);   //获取最后时间
        console.log(lastDate);
        // console.log(capas)
        // console.log(date)
        for (let i = 0; i < data.day; i++) {
            let dd = _.moment(date).add(i, 'days').endOf('day').format('YYYY-MM-DD').toString();
            // console.log(dd)
            if (capas[dd]) {
                _.forEach(capas[dd], (v) => {
                    v.residue = v.capaNum - v.orderNum;
                })


                result[dd] = capas[dd];
            } else {
                if (_.moment(dd).isAfter(lastDate)) {
                    result[dd] = "未分配";

                } else {
                    result[dd] = "非工作日";

                }

            }


        }


        // result.capacityData = capacityData;
        // result.orderData = orderData;
        // result.capaDate = capas;
        // result.orderData = orders;
        // result.allData = allData || [];


        return result;






    }






};
