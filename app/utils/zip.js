/**
 * Created by hgs on 16/8/31.
 *
 * pdf和图片压缩下载service
 */



// import cardDao from '../../../dao/hms/assess/card'
import proDao from '../dao/hms/system/progress'
import fs from 'fs';

import { spawn } from 'child_process'

export default {
    /**
     * 批量压缩方法
     * @param {array} fileArray  //文件数组
     * @param {String} fileName  //压缩目标文件
     * @param {inter} k  //单次压缩数量
     * @param {String} progress  //进度条（数据库）
     * @returns {Promise}
     */

    creatZip: async function (fileArray, fileName, k = 1, progress) {
        // 'use strict';
        return new Promise(function (reslove, reject) {
            // let progress = {
            //     id: '57c3f0b733c6ec58588c558f'
            // };
            progress = progress || false;

            let fileNumbers = fileArray.length;
            console.log(fileNumbers + "-----------");
            let ci = 0;

            console.log(progress)


            let test = function (progress) {
                if (progress) {
                    // console.log('ceshi');
                    // console.log(progress);

                    return proDao.update({ id: progress.id }, {
                        totalNum: fileArray.length,
                        fileName: fileName,
                        finishNum: 0
                    });
                } else {
                    return;
                }
            }

            Promise.all([
                test(progress)
            ]).then(result => {
                let filePath = G.path.public + '/zip/' + fileName;

                //k:为单次压缩的数量
                let zipRecursion = (k) => {


                    let paras = [];
                    if (fs.existsSync(filePath)) {
                        paras = ['u', '-t7z', filePath];
                    } else {
                        paras = ['a', '-t7z', filePath];
                    }
                    for (let i = ci; i < ci + k && i < fileNumbers; i++) {
                        paras.push(fileArray[i]);
                    }
                    console.log(paras)

                    let free = spawn('7za', paras);


                    free.on('error', (err) => {
                        if (progress) {
                            let proResult = {
                                isFinished: true,
                                isSuccess: false,
                                finishNum: fileNumbers,
                                errArray: [err]
                            }
                            proDao.update({ id: progress.id }, proResult)
                                .then(result => {
                                    reject(err);
                                })
                        } else {
                            reject(err);
                        }
                        // reject(err);
                    })
                    // 注册子进程关闭事件 
                    free.on('exit', function (code, signal) {
                        ci += k;
                        console.log(ci + 'ci')
                        console.log(k + 'k')
                        console.log(fileNumbers + 'fileNumbers')

                        if (ci < fileNumbers) {
                            console.error(ci + 'ci')
                            console.error(k + 'k')
                            console.error(progress)
                            if (progress) {

                                proDao.update({ id: progress.id }, { finishNum: ci + 1 })
                                    .then(result => {
                                        console.error(ci + 'ci')
                                        console.error(k + 'k')
                                        // ci += k;
                                        zipRecursion(k)
                                    })
                            } else {
                                // ci += k;
                                console.error('===================')
                                zipRecursion(k)
                            }
                        } else {
                            if (progress) {
                                let proResult = {
                                    isFinished: true,
                                    isSuccess: true,
                                    finishNum: fileNumbers,
                                    fileName: fileName
                                }
                                proDao.update({ id: progress.id }, proResult)
                                    .then(result => {
                                        reslove(true);
                                    })
                            } else {
                                reslove(true);
                            }

                        }
                    });
                }
                zipRecursion(k);

            }).catch(error => {
                // console.log(error);
                // console.log('2222222222222222222222');
                reject(error);

            })
        });
    }
}



