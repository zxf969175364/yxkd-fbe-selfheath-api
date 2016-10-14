/**
 * Created by zjp on 16/7/13.
 */

import resultService from '../result';
import resultConst from '../../../utils/const/result_const'
import reportDao from '../../../dao/hms/basic/report';
import mapping from  './report_mapping';
import fs from 'fs'
import swig from 'swig'
import progress from '../system/progress'
import {spawnSync} from "child_process";

export default {

    /**
     * 根据条件查询单个
     * @param query
     */
    findOne : async function(query){
        "use strict";
        // query['isDelete'] = query['isDelete'] || false;
        return reportDao.findOne(query)
    },

    find:async function(query){
        // query['isDelete'] = query['isDelete'] || false;
        return reportDao.find(query)
    },

    getReport: async function(data){

        let pro = await progress.create({isFinished: false, isSuccess: false});
        let query = {cardId: data.cardId, questionnaireName: data.questionnaireName};
        let report = await this.findOne(query);
        if (!report) {
            let result = await resultService.findOne(query);
            if (!result){
                throw new Error(resultConst.RESULT.RESULT_NOT_EXIST);
            }
            try{
                this.createReport(data.cardId, data.questionnaireName, data.isOld, pro);
            }catch(err){
                console.log(err);
                await progress.update({id: pro.id}, {isFinished: true, isSuccess: false});
            }
        }else {
            pro = {isFinished: true, isSuccess: true, optData:{id:report.id}};
        }
        return pro;
    },

    createReport: async function (cardId, questionnaireName, isOld, pro) {
        let result = await resultService.findOne({cardId: cardId});       //通过测评卡号和问卷名称获取对应的答案
        if (!result){
            progress.update({id: pro.id}, {isFinished: true, isSuccess: false, errArray:[resultConst.RESULT.RESULT_NOT_EXIST]});
            throw new Error(resultConst.RESULT.RESULT_NOT_EXIST);
        }
        let ruleName = getReportRule(questionnaireName);               //通过问卷名称到 mapping 文件中查找问卷对应的报告处理文件名称。
        let data = {};
        data.report = await calContent(result, ruleName, isOld);
        data.cardId = cardId;
        data.isDelete = false;
        data.questionnaireName = questionnaireName;
        let report = await reportDao.create(data);
        this.convertToX(report, pro);
    },

    /**
     * 通过条件获取报告内容,生成对应文件并返回文件路径.
     * @param data
     * @param pro
     */
    convertToX: async function (data, pro) {


        let outDir = G.path.public + '/pdf/' + data.cardId + "/";
        if (!fs.existsSync(outDir)) {
            fs.mkdir(outDir, function (err) {
                if (err) {
                    throw err;
                }
                console.log("创建目录成功");
            });
        }

        let filePath = outDir + data.report.personalInfo.company + '-' + data.report.personalInfo.name + "-" + data.report.personalInfo.cardNumber + ".pdf";
        let name = "";
        if (!data.report.personalInfo.checkId) {
            name = outDir + data.report.personalInfo.name + "-" + data.report.personalInfo.cardNumber + ".jpg";
        } else {
            name = outDir + data.report.personalInfo.checkId + ".jpg";
        }

        let contentFile = G.path.public + '/' + data.cardId + '.html';
        let headerFile = G.path.public + '/' + data.cardId + '-header.html';
        let footerFile = G.path.public + '/' + data.cardId + '-footer.html';
        let template = 'dep.html';

        let footer1 = G.path.view + '/footer.html';
        let header1 = G.path.view + '/header.html';
        let footer2 = 'footer.html';
        let header2 = 'header.html';
        fs.writeFileSync(contentFile, swig.renderFile(template, data), {flag: 'w'});
        fs.writeFileSync(headerFile, swig.renderFile(header2, data), {flag: 'w'});
        fs.writeFileSync(footerFile, swig.renderFile(footer2, data), {flag: 'w'});

        fs.exists(contentFile, function (err) {
            console.log(err);
        });
        console.log('---------------- start convert pdf');
        const ls = spawnSync('wkhtmltopdf',
            [
                '--header-html', headerFile,
                '--margin-top','20',
                '--header-spacing','5',
                '--footer-html', footerFile,
                '--margin-bottom','13',
                '--margin-left','20',
                '--margin-right','20',
                '--footer-spacing','3',
                contentFile,
                filePath
            ]);
        console.log(ls);
        console.log('------------------- convert pdf over');

        console.log(ls.stdout.toString());
        console.log(ls.stderr.toString());
        console.log('----------------- convert pdf to jpg');
        const ls1 = spawnSync('convert', [filePath, name]);
        console.log(ls1.stdout.toString());
        console.log(ls1.stderr.toString());
        console.log('----------------- convert pdf to jpg over');
        progress.update({id: pro.id}, {isFinished: true, isSuccess: true, optData: {id: data.id}});


    }
    /**
     * 通过条件获取报告内容,生成对应文件并返回文件路径.
     * @param data
     * @param type
     * @param pro
     */
/*
    convertToX: async function (data, type, pro) {
        let converter = new wkto();
        let wkhtmltoxDir = '../wkhtmltox/bin';
        converter.wkhtmltopdf = wkhtmltoxDir + '/wkhtmltopdf';
        converter.wkhtmltoimage = wkhtmltoxDir + '/wkhtmltoimage';
        // converter.wkhtmltopdf = '/usr/local/bin/wkhtmltopdf';
        // converter.wkhtmltoimage = '/usr/local/bin/wkhtmltoimage';

        let outDir = G.path.public + '/pdf/' + data.cardId + "/";
        if (!fs.existsSync(outDir)) {
            fs.mkdir(outDir, function (err) {
                if (err) {
                    throw err;
                }
                console.log("创建目录成功");
            });
        }

        let filePath = outDir + data.report.personalInfo.company + '-' + data.report.personalInfo.name + "-" + data.report.personalInfo.cardNumber + ".pdf";
        let name = "";
        if (!data.report.personalInfo.checkId) {
            name = outDir + data.report.personalInfo.name + "-" + data.report.personalInfo.cardNumber + ".jpg";
        } else {
            name = outDir + data.report.personalInfo.checkId + ".jpg";
        }
        let tmpfile = G.path.public + '/' + data.cardId + '.html';
        let headerFile = G.path.public + '/' + data.cardId + '-header.html';
        let footerFile = G.path.public + '/' + data.cardId + '-footer.html';
        let template = 'dep.html';
        let footer = 'footer.html';
        let header = 'header.html';
        // try {
        fs.writeFileSync(tmpfile, swig.renderFile(template, data), {flag: 'w'});
        fs.writeFileSync(headerFile, swig.renderFile(header, data), {flag: 'w'});
        fs.writeFileSync(footerFile, swig.renderFile(footer, data), {flag: 'w'});
        if (!fs.existsSync(tmpfile)) {
            throw new Error('报告内容填写失败。')
        }
        if (type === "pdf") {
            converter.pdf(fs.createReadStream(tmpfile), {pageSize: 'A4'})
                .pipe(fs.createWriteStream(filePath))
                .on('finish', function () {

                    const ls = spawn('convert', [filePath, name]);

                    ls.stdout.on('data', (data) => {
                        console.log(`stdout: ${data}`);
                    });

                    ls.stderr.on('data', (data) => {
                        console.log(`stderr: ${data}`);
                    });

                    ls.on('close', (code) => {
                        progress.update({id: pro.id}, {isFinished: true, isSuccess: true, optData: {id: data.id}});
                        console.log(`child process exited with code ${code}`);
                    });
                })
        } else if (type === "jpg") {
            converter.image(fs.createReadStream(tmpfile), {format: "jpg"}/!*{pageSize: 'letter'}*!/)
                .pipe(fs.createWriteStream(filePath))
                .on('finish', done);
        }
    }
*/
};

function getReportRule(questionnaireName) {
    let fitMapping =  _.find(mapping.REPORT_MAPPING, function (o) {
        return o.questionnaireName === questionnaireName
    });
    return fitMapping.ruleName;
}

async function calContent(result, ruleName, isOld) {
    let filePath = './rules/' + ruleName;
    let rule = require(filePath);
    if (!rule){
        throw new Error('file not exists!')
    }
    return  rule.default.calReport(result, isOld);
}

/**
 * 将问卷结果填到模板中,保存为生成报告需要的 html文件, 返回最后的 html 文件路径.
 * @param resultId
 */
async function fillReport(resultId) {
    //TODO: 这里添加将将测评结果填到报告模板的方法
    return ''
}

/**
 * 生成 pdf 之后的操作.
 */
function done() {
    //TODO: 这里需要操作数据库将文件路径写回到数据库.
    // console.log(Date.now())
    console.log('finish');
}