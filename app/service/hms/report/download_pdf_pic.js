/**
 * Created by hgs on 16/8/31.
 *
 * pdf和图片压缩下载service
 */



import cardDao from '../../../dao/hms/assess/card'
import proDao from '../../../dao/hms/system/progress'
import cardService from '../assess/card'
import fs from 'fs';
import zipTools from '../../../utils/zip';

// import {spawn} from 'child_process'

export default {

    creatZip: async function (query, sess, progress) {
        'use strict';
        query = query || {};
        if (sess.user.roleType !== 'SUADMIN') {
            query[sess.user.idType] = sess.user.orgId;
        }
        query['status'] = query['status'] || 'FINISHED';
        // query['isOld'] = query['isOld'] || true;
        // console.log(query+'query')
        console.log(query)

        let cardsData = await cardDao.find(query);
        let cardsNumber = cardsData.length;
        // let ci = 0;
        let fileName = Date.now() + Math.floor(Math.random() * 10);

        // console.log(cardsData+'----=========')

        await proDao.update({ id: progress.id }, {
            totalNum: cardsNumber,
            fileName: fileName + '.7z'
        });
        // let filePath = G.path.public + '/zip/' + fileName;
        let fileArray = _.map(cardsData, (data) => {
            return G.path.public + '/pdf/' + data.id + '/*.jpg';
        })

        await cardService.downloadEvaluation(query, sess, fileName)
        // console.log(fileArray.length + '=====================')
        if (fileArray.length !== 0) {
            zipTools.creatZip(fileArray, fileName + '.7z', 5, progress);
        } else {
            // console.error('000000000000')
            let proResult = {
                isFinished: true,
                isSuccess: false,
                finishNum: fileArray.length,
                errArray: ['数据不存在']
            }
            // console.error('-----====----')
            let sss = await proDao.update({ id: progress.id }, proResult);
            // console.error(sss)
        }

    },

    downloadPdfs: async function (query) {
        let errArray = {
            errData: [],
            mess:'报告不存在'
        };
        let result = {
            res: 'SUCCESS',
            data: ''
        }
        // let errData = [];
        // query.data = JSON.parse(query.data);
        // console.log(query.data)

        _.forEach(query.data, (data) => {
            
            if (!fs.existsSync(G.path.public + '/pdf/' + data.id)) {
                errArray.errData.push(data.cardNumber)
                // errArray.push({
                //     cardNmber: data.cardNumber,
                //     message: '报告不存在'
                // })
            }
        })
        if (errArray.errData.length !== 0) {
            result.res = 'FAIL';
            result.data = errArray;
        } else {
            let fileArray = _.map(query.data, (data) => {
                return G.path.public + '/pdf/' + data.id + '/*.pdf';
            })

            let cardsId = _.map(query.data, (data) => {
                return data.id;
            })

            let fileName = Date.now() + Math.floor(Math.random() * 10);
            let zipRe = await zipTools.creatZip(fileArray, fileName + '.7z', 5);

            await cardDao.update({ id: cardsId }, { isDownload: true })

            result.res = 'SUCCESS';
            result.data = fileName + '.7z';

        }

        return result;


    }
}



