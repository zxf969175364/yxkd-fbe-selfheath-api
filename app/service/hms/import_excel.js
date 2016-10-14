/**
 * Created by zjp on 16/7/18.
 */

import xlsx from 'xlsx';
import quesService from './questions';
import jexcel from 'json2excel';
import xlsWrite from 'xls-write';
import quesConst from '../../utils/const/question_const';

export default {

    /**
     * 打开指定文件的指定 sheet,并将数据转换为 json,最终以 JSON 格式返回 sheet 中的数据。
     * @param filePath string 文件路径
     * @param sheetName string 需要导入的 sheet 的名称
     * @returns {T[]}  sheet 中数据的 JSON 对象。
     */
    sheetToJSON: function (filePath, sheetName) {
        const workbook = xlsx.readFile(filePath);
        const sheets = workbook.SheetNames;
        if (sheets.indexOf(sheetName) < 0) {
            throw new Error(quesConst.QUESTION.TEMPLATE_ERROR);
        }
        const sheet1 = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(sheet1);
    },

    /**
     * 讲从 excel 中获取的 json 转换为 model 对应的格式,并新建数据。
     * @param json  由 sheetToJSON 得到的 json 对象。
     * @returns {Array}     符合 questions model 对应的数据格式。
     */
    convertToQuestions: async function (json) {
        let groupData = _.groupBy(json, "题干");
        let questions = [];
        let count = await quesService.count({});

        _.forIn(groupData, function (v, k) {
            let question = {};

            question.questionName = k;
            switch (v[0]['题目类型']) {
                case "多选":
                    question.questionType = 'MULTI_CHOICE';
                    break;
                case "单选":
                    question.questionType = 'SINGLE_CHOICE';
                    break;
                case "填空":
                    question.questionType = 'BLANKS';
                    break;

            }
            question.descInfo = [];
            let descinfo = {
                title: v[0]['名词'],
                desc: v[0]['注释内容']
            };
            question.descInfo.push(descinfo);

            question.constrains = [];
            let constrain = {
                "type": "gender",
                "value": v[0]['题目限制条件']
            };
            question.constrains.push(constrain);

            question.questionSer = count++;
            question.isDelete = false;
            question.options = [];
            _.forEach(v, function (option) {

                let op = {};
                op.optionTag = option['选项标号'];
                op.optionName = option['选项内容'];
                op.optionType = option['选项类型'];
                op.isMutex = option['是否互斥'] === "true";

                op.descInfo = [];
                let descinfo = {
                    desc: option['选项注释']
                };
                op.descInfo.push(descinfo);

                op.constrains = [];
                let optionConstrain = {
                    "type": "gender",
                    "value": option['选项限制条件']
                };
                op.constrains.push(optionConstrain);
                question.options.push(op);
            });
            questions.push(question)
        });
        return questions;
    },


    convertToDescription: function (json) {
        let groupData = _.groupBy(json, "名词");
        let data = [];
        _.forEach(groupData, function (v, k) {
            let descs = {};
            descs.word = k;
            descs.description = [];
            _.forEach(v, function (desc) {
                descs.description.push(desc['解释']);
            });

            data.push(descs);

        });
        return data;
    },

    convertToBasicScore: function (json, questionnaireInfo) {
        let data = {};
        data.questionnaireId = questionnaireInfo.questionnaireId;
        data.sectionName = questionnaireInfo.sectionName;
        data.scores = [];
        _.forEach(json, function (v) {
            let basic = {};
            basic.gender = v['性别'];
            basic.age = v['年龄'];
            basic.score = v['得分'];
            data.scores.push(basic);
        });
        return data;
    },

    // writeExcle: async function (data) {


    //     return new Promise(function (reslove, reject) {
    //         jexcel.j2e(data, function (err) {
    //             if (err) return reject(err);
    //             reslove()
    //         });

    //     })

    // },
    
    writeExcle: async function (data) {


        return new Promise(function (reslove, reject) {
            xlsWrite.writeXlsx(data, function (err) {
                if (err) return reject(err);
                reslove()
            });

        })

    },
    



}