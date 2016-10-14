/**
 * Created by hgs on 16/7/19.
 * service
 */


import batchDao from '../../../dao/hms/assess/batch'
import cardDao from '../../../dao/hms/assess/card'
import orgDao from '../../../dao/hms/organizations/organizations'
import proDao from '../../../dao/hms/system/progress'

import BatchConst from '../../../utils/const/batch_const'
import CardConst from '../../../utils/const/card_const'
// import importCardsConst from '../../../utils/const/importCards_const'
import CustomerConst from '../../../utils/const/customer_const'
import extraTools from '../../../utils/tools'
import regular from '../../../utils/regular'
import addcard from '../assess/card'

import smsMessage from '../../../service/hms/sms';


export default {
    /**
     * 新增批次用户信息
     */
    create: async function (batch, cards, sess, progress) {
        'use strict';


        try {
            // let startdd = new Date();
            let result = {
                res: '',
                data: ''
            }


            let query = {};
            // console.log(progress)
            query.batchName = batch.batchName;
            query.centerId = batch.centerId;
            let batresult = await batchDao.findOne(query);

            if (!!batresult) {
                throw new Error(BatchConst.BATCH.BATCH_IS_EXIST)
            } else {




                // console.log(cards);
                // let proData = {
                //     totalNum: cards.length,
                // }

                // delete batch.submit;
                //测评卡总数
                batch.totalNum = cards.length;
                // let progress = await proDao.create(proData);
                let Batch = await batchDao.create(batch);


                let totalNum = cards.length;  //导入测评卡数量
                let succNum = 0;     //校验成功数量
                let orderCount = 0;   //填写体检区数量
                // let dateCount = 0;    //填写日期数量
                let errArray = [];    //错误集合
                // let cardNumbers = [];  //卡号集合
                // let IDNumbers = [];    //身份证集合
                // let customers = [];    //用户集合
                // let cardsDate = [];     //卡集合

                let orgData = await orgDao.findOne({ id: sess.user.orgId });
                if (!orgData) {
                    //体检区不存在
                    let proResult = {
                        isFinished: true,
                        isSuccess: false,
                        errArray: [BatchConst.BATCH.BATCH_IS_EXIST]
                    }
                    await proDao.update({ id: progress.id }, proResult)
                    batchDao.destroy(Batch.id);
                    result.res = 'FAIL';
                    result.data = BatchConst.BATCH.BATCH_IS_EXIST;
                    return result;


                } else {

                    // console.log(orgData)
                    let checkAreas = orgData.checkAreas;     //组织机构体检区

                    let workWeek = orgData.workWeek;     //组织机构工作时间
                    let expelDate = orgData.expelDate;    //组织机构节假日排出时间



                    // let count = await cardDao.countAll({}) || 0;
                    let count = await cardDao.max({ cardNumber: { 'contains': '@' } }, 'cardNumber');
                    if (count.length === 0) count = [{ cardNumber: '@0' }];
                    count = parseInt(count[0]['cardNumber'].slice(1));

                    let datas = [];

                    console.log(cards)

                    for (let d in cards) {
                        let data = cards[d];



                        // cards.forEach(function (data) {

                        //错误描述
                        let err = {
                            name: '',
                            message: ''
                        };

                        let card = {};
                        card.realName = data["姓名"];
                        card.mobile = data["手机"];
                        card.IDNumber = data["身份证号"];
                        card.checkArea = data["体检区"];
                        card.checkId = data["体检号"];
                        card.checkDate = '';                      //data["体检日期"] || '';
                        card.budget = data["预算"];
                        card.company = data["工作单位"];
                        card.Email = data["电子邮箱"];
                        card.height = data["身高(厘米)"];
                        card.weight = data["体重(千克)"];
                        card.occupation = data["职业"];
                        card.education = data["文化程度"];
                        card.maritalStatus = data["婚姻状况"];
                        card.nationality = data["民族"];
                        card.medicare = data["医保类型"];
                        card.familyAddress = data["家庭住址"];
                        card.emergencyName = data["紧急联系人姓名"];
                        card.emergencyTel = data["紧急联系人电话"];
                        card.emergencyEmail = data["紧急联系人邮箱"];



                        //信息验证

                        //姓名
                        if (!(card.realName)) {
                            // throw new Error(CustomerConst.CUSTOMER.NO_REAL_NAME);
                            err.name = card.realName;
                            err.message = CustomerConst.CUSTOMER.NO_REAL_NAME;
                            errArray.push(err);
                            err.name = '';

                        }
                        console.log(card)

                        if (card.budget && card.budget < 100) {
                            err.name = card.realName;
                            err.message = CustomerConst.CUSTOMER.BUDGET_ERR;
                            errArray.push(err);
                        }

                        //手机号验证
                        if (!(card.mobile)) {
                            // throw new Error(CustomerConst.CUSTOMER.NO_TELPHONE);
                            err.name = card.realName;
                            err.message = CustomerConst.CUSTOMER.NO_TELPHONE;
                            errArray.push(err);
                        } else {
                            if (!(regular.checkMobile(card.mobile))) {
                                // throw new Error(CustomerConst.CUSTOMER.WRONG_MOBILE);
                                err.name = card.realName;
                                err.message = CustomerConst.CUSTOMER.WRONG_MOBILE;
                                errArray.push(err);
                            }
                        }

                        //身份证号
                        if (!!(card.IDNumber)) {
                            if (!(regular.checkID(card.IDNumber))) {
                                // throw new Error(CustomerConst.CUSTOMER.WRONG_ID);
                                err.name = card.realName;
                                err.message = CustomerConst.CUSTOMER.WRONG_ID;
                                errArray.push(err);
                            }
                        }


                        //体检区是否填写

                        if (!!(card.checkArea)) {
                            //判断体检区是否合法

                            let arResult = _.find(checkAreas, (data) => {

                                return data.checkAreaName === card.checkArea;
                            })

                            if (arResult) {
                                orderCount++;
                                if (_.moment(card.checkDate).isValid()) {
                                    //判断体检日期是否在工作日内


                                    let flag = true;
                                    _.forEach(expelDate, (v) => {
                                        // console.log(v.start)
                                        if (_.moment(card.checkDate).isBetween(_.moment(v.start), _.moment(v.end))) {
                                            flag = false;
                                        }
                                    });

                                    if (flag && (workWeek[_.moment(card.checkDate).locale('en').format('dddd').toString()])) {
                                        // dateCount++;
                                    } else {
                                        err.name = card.realName;
                                        err.message = CardConst.ASSESSCARD.NOT_WORK_DATE;
                                        errArray.push(err);
                                    }
                                }
                            } else {
                                //体检区不合法
                                err.name = card.realName;
                                err.message = CardConst.ASSESSCARD.NO_CHECKAREA;
                                errArray.push(err);
                            }

                            // } else {
                            // if (!!(card.checkDate)) {
                            //     //没有填写体检区就填写了体检日期
                            //     err.name = card.realName;
                            //     err.message = CardConst.ASSESSCARD.NO_CHECKAREA_BEFOR_CHECKDATE;
                            //     errArray.push(err);

                            // }

                        }



                        card.cardNumber = extraTools.createCardNumber(8, count);
                        card.password = extraTools.createPassword(6);
                        card.batchName = batch.batchName;
                        card.batchId = Batch.id;
                        card.agencyId = Batch.agencyId;
                        card.hospitalId = Batch.hospitalId;
                        card.centerId = Batch.centerId;
                        card.count = 1;
                        datas.push(card);
                        // cardNumbers.push(card.cardNumber);
                        // IDNumbers.push({ IDNumber: card.IDNumber });

                        count++;
                        succNum++;
                        // console.log(succNum)
                        // if (err.message === '') {    function
                        console.log(succNum)
                        if (succNum % 100 === 0)
                            await proDao.update({ id: progress.id }, { finishNum: succNum });
                        // }

                        // });
                    }



                    if (errArray.length !== 0) {
                        //更新进度信息
                        let proResult = {
                            isFinished: true,
                            isSuccess: false,
                            errArray: errArray
                        }
                        await proDao.update({ id: progress.id }, proResult)
                        batchDao.destroy(Batch.id);
                        result.res = 'FAIL';
                        result.data = errArray;
                        return result;

                    } else {
                        // let enddd = new Date();
                        batchDao.update({ id: Batch.id }, { totalCard: orderCount });
                        // console.log(datas)
                        try {
                            console.log('sucsses')
                            // let addresult = await addcard.addCardsWithUserInfo(cardNumbers, IDNumbers, datas);
                            let addresult = await addcard.addCards(datas);
                            console.error(addresult)
                            console.error(orderCount)


                            //整个批次都无预约的卡，直接发送短信
                            if (orderCount === 0) {
                                let smsCards = {};
                                smsCards.data = JSON.stringify(_.map(addresult, (data) => {
                                    return data.id;
                                }))
                                console.log(smsCards)
                                console.log(sess)
                                // smsCards = JSON.stringify(smsCards)
                                smsMessage.sendCardsSMS(smsCards, sess);
                            }
                            //更新进度信息
                            let proResult = {
                                isFinished: true,
                                isSuccess: true,
                                finishNum: cards.length
                            }
                            await proDao.update({ id: progress.id }, proResult)






                            result.res = 'SUCCESS';
                            result.data = addresult;
                        } catch (error) {
                            console.log('fail')
                            //更新进度信息
                            let proResult = {
                                isFinished: true,
                                isSuccess: false,
                                errArray: [error]
                            }
                            proDao.update({ id: progress.id }, proResult)

                            await batchDao.destroy(Batch.id);//批次回滚
                            // await cardDao.destroy(Batch.id);//测评卡回滚
                            await cardDao.update({ batchId: Batch.id }, { isDelete: true })
                            // throw error;
                        }

                        // addcard.addCardWithUserInfo(card);
                        // console.log(enddd - startdd)

                        //体检区、体检日期全部已预约
                        // if (totalNum === orderCount && totalNum === dateCount) {

                        // }
                        return result
                    }


                    // addcard.addCardWithUserInfo(datas);
                    // // addcard.addCardWithUserInfo(card);
                    // return Batch

                }
            }

        } catch (error) {
            console.log(error)

        }


    }

}