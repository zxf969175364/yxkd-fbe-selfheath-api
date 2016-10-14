/**
 * Created by zjp on 16/7/13.
 */

import cardService from '../../assess/card';
import questionnaireService from '../../questionnaire';
import srService from  '../../rules/score_rule';
import crService from  '../../rules/content_rule';
import rConst from '../../../../utils/const/rule_const';
import descService from '../../description';
import orgService from '../../organizations/organization';
import bsService from '../../../../service/hms/rules/basic_score'
import reportConst from '../../../../utils/const/report_const'
import path from 'path'

export default{

    calReport: async function (result, isOld) {

        const resourcePath = path.join(G.path.app, '/view/dep/yyReport');

        let totalScore = 0;
        let content = {};

        //TODO: 添加通过问卷结果到报告内容的处理过程。
        content.reportType = "basic";
        content.questionnaireName = result.questionnaireName;
        let cardInfo = await cardService.findOne({id: result.cardId, isOld:isOld});
        if (!cardInfo){
            throw new Error(reportConst.GEN_ERR_NO_CARD_INFO);
        }
        let orgInfo = await orgService.findOne({id: cardInfo.centerId});
        if (!orgInfo){
            throw new Error(reportConst.GEN_ERR_NO_ORG_INFO);
        }
        let questionnaireInfo = await questionnaireService.findOne({id: result.questionnaireId});
        if (!questionnaireInfo){
            throw new Error(reportConst.GEN_ERR_NO_QUESTIONNAIRE_INFO);
        }
        let diseases = ['高血压', '糖尿病', '脑卒中', '冠心病', '睡眠质量', '总体健康状况'];
        let contentRules = await crService.find({questionnaireId: questionnaireInfo.id, section: diseases, isDelete:false});
        if (!contentRules){
            throw new Error(reportConst.GEN_ERR_NO_CONTENT_RULE);
        }
        let formatResult = formatQuestion(result);

        let header = {};
        header.logo = path.join(G.path.app, '/view/dep/mlogo.png');
        if (orgInfo.logoUrl) {
            header.logo = path.join(G.path.app, orgInfo.logoUrl.substring(-1, orgInfo.logoUrl.length - 8));
        }
        header.name = orgInfo.name;

        content.header = header;
        let footer = {};
        footer.addr = orgInfo.address;
        footer.tel = orgInfo.contactPhone;
        content.footer = footer;

        let personalInfo = {};
        personalInfo.ID = cardInfo.IDNumber;
        personalInfo.testTime = _.moment(result.updatedAt).format("YYYY-MM-DD");
        personalInfo.name = cardInfo.realName;
        personalInfo.gender = cardInfo.gender;
        personalInfo.age = cardInfo.age;
        personalInfo.company = cardInfo.company;
        personalInfo.checkId = cardInfo.checkId;
        personalInfo.cardNumber = cardInfo.cardNumber;

        content.personalInfo = personalInfo;

        content.summary = result.summary;
        let sections = [];

        _.forEach(result.section, function (v) {
            let section = {};
            section.show = true;
            section.sectionName = v.sectionName;
            section.score = v.result.score;
            section.level = v.result.level;
            section.src = resourcePath + section.level + ".png";
            section.levelName = v.result.levelName;
            section.desc = v.result.desc;
            section.info = generateSectionContent(formatResult, v.sectionName, v.result.level);

            switch (section.sectionName) {
                case "健康史":
                    totalScore += parseFloat(section.score) * 4;
                    section.index = 1;
                    break;
                case "躯体症状":
                    totalScore += parseFloat(section.score) * 4;
                    section.index = 2;
                    break;
                case "生活习惯":
                    totalScore += parseFloat(section.score) * 2;
                    section.index = 3;
                    break;
                case "心理健康":
                    totalScore += parseFloat(section.score) * 3;
                    section.index = 4;
                    break;
                case "健康素养":
                    totalScore += parseFloat(section.score);
                    section.index = 6;
                    break;
            }
            sections.push(section);

        });

        let sleepScore = await sleep(formatResult);
        let sleepSection = genContentByScore(contentRules, "睡眠质量", sleepScore);
        if (!sleepSection){
            throw new Error(reportConst.GEN_ERR_SLEEP_ERR);
        }
        sleepSection.sectionName = "睡眠质量";
        sleepSection.show = true;
        sleepSection.score = sleepScore;
        sleepSection.info = generateSectionContent(formatResult, sleepSection.sectionName, sleepSection.level);
        sleepSection.index = 5;
        sleepSection.src = resourcePath + sleepSection.level + ".png";

        sections.push(sleepSection);
        totalScore += sleepScore * 2;

        let summaryScore = totalScore / 16;
        let summarySection = genContentByScore(contentRules, "总体健康状况", summaryScore);
        if (!summarySection){
            throw new Error(reportConst.GEN_ERR_SUMMARY_ERR);
        }
        summarySection.score = summaryScore;
        content.summary = summarySection;

        let diet = {};
        diet.score =await cal(formatResult, "生活习惯", ["49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66"], questionnaireInfo.id);
        diet.sectionName = "饮食";
        diet.show = false;
        sections.push(diet);

        let smoking = {};
        smoking.score = await cal(formatResult, '生活习惯', ['67', '68', '69', '70'], questionnaireInfo.id);
        smoking.sectionName = "吸烟";
        smoking.show = false;

        sections.push(smoking);

        let drinking = {};
        drinking.score =await cal(formatResult, "生活习惯", ["71","72","73","74","75","76"], questionnaireInfo.id);
        drinking.sectionName = "饮酒";
        drinking.show = false;

        sections.push(drinking);

        let sport = {};
        sport.score =await cal(formatResult, "生活习惯", ["77","78","79","80","81","82","83","84","85"], questionnaireInfo.id);
        sport.sectionName = "运动锻炼";
        sport.show = false;
        sections.push(sport);

        content.sections = sections;
        let disease = [];
        for (let i = 0; i < diseases.length; i++) {
            if (diseases[i] === "睡眠质量" || diseases[i] === "总体健康状况"){
                continue;
            }

            let dis = {};
            dis.confirmed = false;
            let option;
            switch (diseases[i]) {
                case "高血压":
                    option = ["A"];
                    break;
                case "脑卒中":
                    option = ["B"];
                    break;
                case "冠心病":
                    option = ["C"];
                    break;
                case "糖尿病":
                    option = ["F"];
                    break;
            }

            if (checkOption(formatResult, 5, option)) {
                dis.confirmed = true;
                var section = _.find(result.section, function (o) {
                    return o.sectionName = "健康史"
                });
                var question = _.find(section.questions, function (o) {
                    return o.questionSer === "5"
                });
                var answer = _.find(question.answer, function (o) {
                    return o.tag === option[0];
                });
                let sickTime = answer.age;
                dis.desc = `${sickTime}年您已确诊为${diseases[i]}，请您注意控制相关危险因素，配合医生积极治疗，将血压控制的合理水平。`;
                dis.levelName = diseases[i];
                dis.define = await getRandomDesc(diseases[i]);
                dis.advice = "疾病建议";
                dis.index = i + 1;
                dis.diseaseName = diseases[i];
            } else {
                let sc = await score2(diseases[i], formatResult, cardInfo);
                let rules = _.find(contentRules, function (cr) {
                    return cr.section === diseases[i]
                });
                dis = _.find(rules.levels, function (level) {
                    return level.minScore <= sc.score && level.maxScore > sc.score;
                });
                if (dis) {
                    dis.define = await getRandomDesc(diseases[i]);
                    //TODO: 2 dis 中需要根据评估得分与最佳状态的分值比较,然后添加疾病建议。
                    dis.advice = "疾病建议";
                    dis.score = sc.score.toFixed(2);
                    dis.index = i + 1;
                    dis.bestScore = sc.bestScore.toFixed(2);
                    dis.diseaseName = diseases[i];
                    dis.confirmed = false;
                } else {
                    throw new Error(rConst.CALCULATE_LEVEL_ERROR);
                }
            }
            disease.push(dis);
        }
        content.sections = _.orderBy(content.sections, ['index'], ['asc']);
        content.disease = disease;
        content.risk = generateAdviceContent(formatResult, cardInfo, result);
        return content;
    }
}

async function score2(diseaseName, formatResult, cardInfo) {
    switch (diseaseName) {
        case "高血压":
            return await hypertension(cardInfo, formatResult);
        case "脑卒中":
            return await stroke(cardInfo, formatResult);
        case "冠心病":
            return await coronary(cardInfo, formatResult);
        case "糖尿病":
            return await diabetes(cardInfo, formatResult);
    }
}

async function hypertension(cardInfo, formatResult) {
    let sc = {};
    sc.score = 0;
    let a1 = await calBasicScore(cardInfo, "高血压");
    let a2 = calBMIScore(cardInfo);
    let a3 = checkOption(formatResult, 1, "A") ? 1 : 0;     //判断高血压家族病逝,需要重新对应题好及规则
    let a4 = 0;         //饮食--高盐饮食
    if (checkOption(formatResult, 56, "B") || checkOption(formatResult, 57, "A")) {
        a4 = 2;
    }

    let a5 = 0;         //吸烟
    let a5t = checkOption(formatResult, 71, ["B", "C", "D"]) && checkOption(formatResult, 72, ["B", "C", "D"]);
    if (checkOption(formatResult, 70, ["B"]) && a5t) {
        a5 = 2;
    } else if (checkOption(formatResult, 70, ["C"]) && a5t && checkOption(formatResult, 73, ["A"])) {
        a5 = 1.5;
    } else if (checkOption(formatResult, 70, ["D"])) {
        a5 = 1;
    }

    let a6 = 0;         //饮酒
    let a6t = checkOption(formatResult, 75, ["A"])
        && checkOption(formatResult, 76, ["B", "C"])
        && checkOption(formatResult, 77, ["B", "C"])
        && checkOption(formatResult, 78, ["B", "C", "D"]);
    if (checkOption(formatResult, 74, ["B"]) && a6t) {
        a6 = 2;
    } else if (checkOption(formatResult, 74, ["C"]) && a6t && checkOption(formatResult, 79, ["A"])) {
        a6 = 1;
    }

    let a7 = 0;         //运动 -- 体力活动
    if (checkOption(formatResult, 80, ["A"])) {
        a7 = 1.5;
    } else if (checkOption(formatResult, 80, ["B"]) && checkOption(formatResult, 82, ["A"]) && checkOption(formatResult, 83, ["A"])) {
        a7 = 1;
    }

    let a8 = 0;          //运动 -- 静坐生活方式
    if (checkOption(formatResult, 85, ["A"])
        && checkOption(formatResult, 86, ["B", "C"])
        && checkOption(formatResult, 87, ["C", "D"])
        && checkOption(formatResult, 88, ["C", "D"])) {
        a8 = 1.5;
    } else if (checkOption(formatResult, 85, ["E"]) && checkOption(formatResult, 88, ["E"])) {
        a8 = 1.5;
    }

    let a9 = 0;
    let a9s = 5;
    if (a9s >= 5) {
        a9 = 1.5;
    }

    sc.score = a1 + a2 + a3 + a4 + a5 + a6 + (a7 + a8) / 2 + a9;
    sc.bestScore = a1 + a3;

    return sc;
}

async function stroke(cardInfo, formatResult) {
    let sc = {};
    sc.score = 0;
    let b1 = await calBasicScore(cardInfo, "脑卒中");
    let b2 = calBMIScore(cardInfo);
    // 第四题需要单独计算。
    let b3 = checkOption(formatResult, 1, ["B"]) && checkOption(formatResult, 4, ["A"]) ? 3 : 0;        //脑卒中家族史
    let b4 = checkOption(formatResult, 5, ["A"]) ? 4 : 0;                                               //高血压史
    let b5 = checkOption(formatResult, 5, ["C", "D"]) ? 4 : 0;                                          //心血管病史
    let b6 = checkOption(formatResult, 5, ["F"]) ? 3 : 0;                                               //糖尿病史
    let b7 = checkOption(formatResult, 5, ["W"]) ? 3 : 0;                                               //血脂异常
    let b8 = checkOption(formatResult, 57, ["B"]) || checkOption(formatResult, 65, ["C"]) ? 3 : 0;      //高脂饮食

    let b9 = 0;                 //吸烟
    let b9t = checkOption(formatResult, 71, ["B", "C", "D"]) && checkOption(formatResult, 72, ["B", "C", "D"]);
    if (checkOption(formatResult, 70, ["B"]) && b9t) {
        b9 = 2;
    } else if (checkOption(formatResult, 70, ["C"]) && b9t && checkOption(formatResult, 73, ["A"])) {
        b9 = 1.5;
    } else if (checkOption(formatResult, 70, ["D"])) {
        b9 = 1;
    }

    let b10 = 0;         //饮酒
    let b10t = checkOption(formatResult, 75, ["A"])
        && checkOption(formatResult, 76, ["B", "C"])
        && checkOption(formatResult, 77, ["B", "C"])
        && checkOption(formatResult, 78, ["B", "C", "D"]);
    if (checkOption(formatResult, 74, ["B"]) && b10t) {
        b10 = 2;
    } else if (checkOption(formatResult, 74, ["C"]) && b10t && checkOption(formatResult, 79, ["A"])) {
        b10 = 1;
    }

    let b11 = 0;         //运动 -- 体力活动
    if (checkOption(formatResult, 80, ["A"])) {
        b11 = 2;
    } else if (checkOption(formatResult, 80, ["B"]) && checkOption(formatResult, 82, ["A"]) && checkOption(formatResult, 83, ["A"])) {
        b11 = 1.5;
    }

    let b12 = 0;          //运动 -- 静坐生活方式
    if (checkOption(formatResult, 85, ["A"])
        && checkOption(formatResult, 86, ["B", "C"])
        && checkOption(formatResult, 87, ["C", "D"])
        && checkOption(formatResult, 88, ["C", "D"])) {
        b12 = 2;
    } else if (checkOption(formatResult, 85, ["E"]) && checkOption(formatResult, 88, ["E"])) {
        b12 = 2;
    }
    sc.score = b1 + b2 + b3 + b4 + b5 + b6 + b7 + b8 + b9 + b10 + (b11 + b12) / 2;
    sc.bestScore = b1 + b3;
    return sc;
}

async function coronary(cardInfo, formatResult) {
    let sc = {};
    sc.score = 0;
    let c1 = await calBasicScore(cardInfo, "冠心病");
    let c2 = calBMIScore(cardInfo);
    //第4题需要重新计算
    let c3 = checkOption(formatResult, 1, ["C"]) && checkOption(formatResult, 4, ["A"]) ? 2 : 0;        //冠心病家族史
    let c4 = checkOption(formatResult, 5, ["A"]) ? 2 : 0;                                               //高血压史
    let c5 = checkOption(formatResult, 5, ["F"]) ? 3 : 0;                                               //糖尿病史
    let c6 = checkOption(formatResult, 5, ["W"]) ? 2 : 0;                                               //血脂异常
    let c7 = checkOption(formatResult, 57, ["B"]) || checkOption(formatResult, 65, ["C"]) ? 3 : 0;      //高脂饮食
    let c8 = 0;                 //吸烟
    let c8t = checkOption(formatResult, 71, ["B", "C", "D"]) && checkOption(formatResult, 72, ["B", "C", "D"]);
    if (checkOption(formatResult, 70, ["B"]) && c8t) {
        c8 = 2;
    } else if (checkOption(formatResult, 70, ["C"]) && c8t && checkOption(formatResult, 73, ["A"])) {
        c8 = 1.5;
    } else if (checkOption(formatResult, 70, ["D"])) {
        c8 = 1;
    }

    let c9 = 0;         //运动 -- 体力活动
    if (checkOption(formatResult, 80, ["A"])) {
        c9 = 2;
    } else if (checkOption(formatResult, 80, ["B"]) && checkOption(formatResult, 82, ["A"]) && checkOption(formatResult, 83, ["A"])) {
        c9 = 1.5;
    }
    let c10 = 0;          //运动 -- 静坐生活方式
    if (checkOption(formatResult, 85, ["A"])
        && checkOption(formatResult, 86, ["B", "C"])
        && checkOption(formatResult, 87, ["C", "D"])
        && checkOption(formatResult, 88, ["C", "D"])) {
        c10 = 2;
    } else if (checkOption(formatResult, 85, ["E"]) && checkOption(formatResult, 88, ["E"])) {
        c10 = 2;
    }

    let c11 = 0;                //精神压力
    let c11s = 5;
    if (c11s >= 5) {
        c11 = 1.5;
    }
    sc.score = c1 + c2 + c3 + c4 + c5 + c6 + c7 + c8 + (c9 + c10) / 2 + c11;

    sc.bestScore = c1 + c3;
    return sc;
}

async function diabetes(cardInfo, formatResult) {
    let sc = {};
    sc.score = 0;
    let d1 = await calBasicScore(cardInfo, "糖尿病");
    let d2 = calBMIScore(cardInfo);
    let d3 = checkOption(formatResult, 1, ["E"]) ? 3 : 0;                               //糖尿病家族史
    let d4 = checkOption(formatResult, 5, ["V"]) ? 4 : 0;                               //糖调节损
    let d5 = checkOption(formatResult, 24, ["A"]) ? 2 : 0;                              //妊娠糖尿病
    let d6 = checkOption(formatResult, 5, ["A"]) ? 3 : 0;                               //高血压史
    let d7 = checkOption(formatResult, 5, ["B", "C", "D"]) ? 3 : 0;                     //心脑血管疾病
    let d8 = checkOption(formatResult, 5, ["W"]) ? 3 : 0;                               //血脂异常
    let d9 = checkOption(formatResult, 5, ["Y"]) ? 2 : 0;                               //精神疾病
    let d10 = checkOption(formatResult, 10, ["A", "C", "J", "N"]) ? 2 : 0;              //用药史

    let d11 = 0;            //饮食
    if (checkOption(formatResult, 55, ["C"])) {
        d11 = 1.5;
    } else if (checkOption(formatResult, 55, ["D"])) {
        d11 = 2;
    }
    let d12 = 0;         //运动 -- 体力活动
    if (checkOption(formatResult, 80, ["A"])) {
        d12 = 2;
    } else if (checkOption(formatResult, 80, ["B"]) && checkOption(formatResult, 82, ["A"]) && checkOption(formatResult, 83, ["A"])) {
        d12 = 1.5;
    }
    let d13 = 0;          //运动 -- 静坐生活方式
    if (checkOption(formatResult, 85, ["A"])
        && checkOption(formatResult, 86, ["B", "C"])
        && checkOption(formatResult, 87, ["C", "D"])
        && checkOption(formatResult, 88, ["C", "D"])) {
        d13 = 2;
    } else if (checkOption(formatResult, 85, ["E"]) && checkOption(formatResult, 88, ["E"])) {
        d13 = 2;
    }

    sc.score = d1 + d2 + d3 + d4 + d5 + d6 + d7 + d8 + d9 + d10 + d11 + (d12 + d13) / 2;
    sc.bestScore = d1 + d3;
    return sc;
}

async function sleep(formatResult) {

    let s1 = 0;
    if (checkOption(formatResult, 99, ["A"])){
        s1 = 0;
    }else if (checkOption(formatResult, 99, ["B"])){
        s1 = 0.5
    }else if (checkOption(formatResult, 99, ["C"])){
        s1 = 1;
    }

    let s2 = 0;
    if (checkOption(formatResult, 100, ["A","B","C","D","E","F"])){
        s2 = 1;
    }
    let s3 = 0;
    if (checkOption(formatResult, 101, ["A","B","C","D","E","F","G"])){
        s3 = 1;
    }
    let s4 = 0;
    if (checkOption(formatResult, 102, ["A"])){
        s4 = 1;
    }else if(checkOption(formatResult, 102, ["B"])){
        s4 = 0.5;
    }else if (checkOption(formatResult, 102, ["C"])){
        s4 = 0;
    }else if (checkOption(formatResult, 102, ["D"])){
        s4 = 0.5;
    }

    return (s1 + s2 + s3 + s4) /4;


}

function checkOption(formatResult, questionSer, tagArray) {
    questionSer = questionSer.toString();
    let answer = formatResult[questionSer];
    let result = false;
    if (answer) {
        _.forEach(tagArray, function (tag) {
            if (answer.indexOf(tag) > -1) {
                result = true;
            }
        });
    }
    return result;

}


/**
 * 格式化普通纬度的题的数据格式(扁平化)
 * @param result 数据库返回的结果
 * @returns {{}}  扁平化以后的结果。
 */
function formatQuestion(result) {
    let formatResult = {};
    let questions = [];
    _.forEach(result.section, function (v) {
        questions = _.concat(questions, v.questions);
    });
    _.forEach(questions, function (v) {
        if (v.questionSer === "0") {
            let answers = [];
            _.forEach(v.answer, function (v1) {
                answers = _.unionWith(answers, v1.disease, _.isEqual);
            });
            let g = _.groupBy(answers, 'questionSer');
            _.forEach(g, function (v2, k) {
                let tags = [];
                _.forEach(v2, function (v3) {
                    tags.push(v3.tag);
                });
                formatResult[k] = tags;
            });
        } else {
            let tags = [];
            _.forEach(v.answer, function (v1) {
                tags.push(v1.tag);
            });
            formatResult[v.questionSer] = tags;
        }
    });
    return formatResult;
}


/**
 * 根据身高、体重计算 RMI,并从设置的评级规则总获取对应的分数。
 */
function calBMIScore(cardInfo) {
    //TODO: 添加计算 RMI 并获取对应分值的方法
    let BMI = cardInfo.weight / Math.pow(cardInfo.height/100, 2);
    if (BMI < 24) {
        return 0;
    } else if (BMI >= 24 && BMI < 28) {
        return 1.5;
    } else if (BMI >= 28 && BMI < 32) {
        return 2;
    } else if (BMI >= 32 && BMI < 36) {
        return 2.5;
    } else {
        return 3;
    }
}

/**
 * 根据年龄、性别计算基本得分
 */
async function calBasicScore(cardInfo, sectionName) {
    //TODO: 添加通过个人信息获取的年龄和性别获取基本得分的方法。
    let q = {questionnaireId: cardInfo.questionnaireId, sectionName: sectionName};
    let data = await bsService.findOne(q);
    let score = _.find(data.scores, function (o) {
        return o.gender === cardInfo.gender && o.age == Math.round(parseInt(cardInfo.age));
    });
    return parseFloat(score.score);
}

/**
 * 根据疾病内容随机获取对应的疾病描述。
 * @returns {string}
 */
async function getRandomDesc(diseaseName) {
    //TODO: 添加根据疾病名称获取对应疾病描述的方法。

    let descs = await descService.findOne({word: diseaseName});
    return descs.description[parseInt(Math.random() * descs.description.length, 10)];
}

/**
 * 根据答案生成各个纬度的文字内容
 */
function generateSectionContent(formatResult, sectionName, level) {
    level = parseInt(level);
    switch (sectionName){
        case "健康史":
            return healthHistory(formatResult, level);
        case "躯体症状":
            return symptoms(formatResult, level);
        case "生活习惯":
            return habits(formatResult, level);
        case "心理健康":
            return pressure(formatResult, level);
        case "睡眠质量":
            return qualityOfSleep(formatResult, level);
        case "健康素养":
            return literacy(level);

    }


}

function healthHistory(formatResult, level) {

    let str = "";
    if (checkOption(formatResult, 1, ["A"])) {
        str += "高血压家族史、"
    }
    if (checkOption(formatResult, 1, ["B"])) {
        str += "脑卒中（中风）家族史、"
    }
    if (checkOption(formatResult, 1, ["C"])) {
        str += "冠心病家族史、"
    }
    if (checkOption(formatResult, 1, ["D"])) {
        str += "外周血管病家族史、"
    }
    if (checkOption(formatResult, 1, ["E"])) {
        str += "糖尿病家族史、"
    }
    if (checkOption(formatResult, 1, ["F"])) {
        str += "肥胖症家族史、"
    }
    if (checkOption(formatResult, 1, ["G"])) {
        str += "慢性肾脏疾病家族史、"
    }
    if (checkOption(formatResult, 1, ["H"])) {
        str += "慢性阻塞性肺病家族史、"
    }
    if (checkOption(formatResult, 1, ["I"])) {
        str += "骨质疏松家族史、"
    }
    if (checkOption(formatResult, 1, ["J"])) {
        str += "痛风家族史、"
    }
    if (checkOption(formatResult, 1, ["K"])) {
        str += "风湿免疫性疾病家族史、"
    }
    if (checkOption(formatResult, 1, ["L"])) {
        str += "精神疾病家族史、"
    }
    if (checkOption(formatResult, 1, ["N"])) {
        str += "慢病家族史、"
    }
    if (checkOption(formatResult, 2, ["A"])) {
        str += "肺癌家族史、"
    }
    if (checkOption(formatResult, 2, ["B"])) {
        str += "肝癌家族史、"
    }
    if (checkOption(formatResult, 2, ["C"])) {
        str += "胃癌家族史、"
    }
    if (checkOption(formatResult, 2, ["D"])) {
        str += "食管癌家族史、"
    }
    if (checkOption(formatResult, 2, ["E"])) {
        str += "结直肠癌家族史、"
    }
    if (checkOption(formatResult, 2, ["F"])) {
        str += "白血病家族史、"
    }
    if (checkOption(formatResult, 2, ["G"])) {
        str += "脑瘤家族史、"
    }
    if (checkOption(formatResult, 2, ["H"])) {
        str += "乳腺癌家族史、"
    }
    if (checkOption(formatResult, 2, ["I"])) {
        str += "胰腺癌家族史、"
    }
    if (checkOption(formatResult, 2, ["J"])) {
        str += "骨癌家族史、"
    }
    if (checkOption(formatResult, 2, ["K"])) {
        str += "膀胱癌家族史、"
    }
    if (checkOption(formatResult, 2, ["L"])) {
        str += "鼻咽癌家族史、"
    }
    if (checkOption(formatResult, 2, ["M"])) {
        str += "宫颈癌家族史、"
    }
    if (checkOption(formatResult, 2, ["N"])) {
        str += "子宫癌家族史、"
    }
    if (checkOption(formatResult, 2, ["O"])) {
        str += "前列腺癌家族史、"
    }
    if (checkOption(formatResult, 2, ["P"])) {
        str += "卵巢癌家族史、"
    }
    if (checkOption(formatResult, 2, ["Q"])) {
        str += "甲状腺癌家族史、"
    }
    if (checkOption(formatResult, 2, ["R"])) {
        str += "皮肤癌家族史、"
    }
    if (checkOption(formatResult, 2, ["S"])) {
        str += "恶性肿瘤家族史、"
    }
    if (checkOption(formatResult, 5, ["A"])) {
        str += "高血压、"
    }
    if (checkOption(formatResult, 5, ["B"])) {
        str += "脑卒中病、"
    }
    if (checkOption(formatResult, 5, ["C"])) {
        str += "冠心病、"
    }
    if (checkOption(formatResult, 5, ["D"])) {
        str += "外周血管病、"
    }
    if (checkOption(formatResult, 5, ["E"])) {
        str += "脂肪肝、"
    }
    if (checkOption(formatResult, 5, ["F"])) {
        str += "糖尿病、"
    }
    if (checkOption(formatResult, 5, ["G"])) {
        str += "慢性肾脏疾病、"
    }
    if (checkOption(formatResult, 5, ["H"])) {
        str += "慢性胃炎或胃溃疡病、"
    }
    if (checkOption(formatResult, 5, ["I"])) {
        str += "幽门螺杆菌感染病、"
    }
    if (checkOption(formatResult, 5, ["J"])) {
        str += "胃息肉病、"
    }
    if (checkOption(formatResult, 5, ["K"])) {
        str += "肠道息肉病、"
    }
    if (checkOption(formatResult, 5, ["L"])) {
        str += "慢性阻塞性肺病、"
    }
    if (checkOption(formatResult, 5, ["M"])) {
        str += "哮喘病、"
    }
    if (checkOption(formatResult, 5, ["N"])) {
        str += "胰腺炎、"
    }
    if (checkOption(formatResult, 5, ["O"])) {
        str += "骨质疏松、"
    }
    if (checkOption(formatResult, 5, ["P"])) {
        str += "慢性肝炎或肝硬化、"
    }
    if (checkOption(formatResult, 5, ["Q"])) {
        str += "胆囊与胆管疾病、"
    }
    if (checkOption(formatResult, 5, ["R"])) {
        str += "结核病、"
    }
    if (checkOption(formatResult, 5, ["S"])) {
        str += "风湿免疫性疾病、"
    }
    if (checkOption(formatResult, 5, ["T"])) {
        str += "前列腺炎或肥大、"
    }
    if (checkOption(formatResult, 5, ["U"])) {
        str += "慢性乳腺疾病、"
    }
    if (checkOption(formatResult, 5, ["V"])) {
        str += "血糖异常、"
    }
    if (checkOption(formatResult, 5, ["W"])) {
        str += "血脂异常、"
    }
    if (checkOption(formatResult, 5, ["X"])) {
        str += "痛风或尿酸升高、"
    }
    if (checkOption(formatResult, 5, ["Z"])) {
        str += "疾病史、"
    }
    if (checkOption(formatResult, 6, ["A"])) {
        str += "肺癌、"
    }
    if (checkOption(formatResult, 6, ["B"])) {
        str += "肝癌、"
    }
    if (checkOption(formatResult, 6, ["C"])) {
        str += "胃癌、"
    }
    if (checkOption(formatResult, 6, ["D"])) {
        str += "食管癌、"
    }
    if (checkOption(formatResult, 6, ["E"])) {
        str += "结直肠癌、"
    }
    if (checkOption(formatResult, 6, ["F"])) {
        str += "白血病、"
    }
    if (checkOption(formatResult, 6, ["G"])) {
        str += "脑瘤、"
    }
    if (checkOption(formatResult, 6, ["H"])) {
        str += "乳腺癌、"
    }
    if (checkOption(formatResult, 6, ["I"])) {
        str += "胰腺癌、"
    }
    if (checkOption(formatResult, 6, ["J"])) {
        str += "骨癌、"
    }
    if (checkOption(formatResult, 6, ["K"])) {
        str += "膀胱癌、"
    }
    if (checkOption(formatResult, 6, ["L"])) {
        str += "鼻咽癌、"
    }
    if (checkOption(formatResult, 6, ["M"])) {
        str += "宫颈癌、"
    }
    if (checkOption(formatResult, 6, ["N"])) {
        str += "子宫癌、"
    }
    if (checkOption(formatResult, 6, ["O"])) {
        str += "前列腺癌、"
    }
    if (checkOption(formatResult, 6, ["P"])) {
        str += "卵巢癌、"
    }
    if (checkOption(formatResult, 6, ["Q"])) {
        str += "甲状腺癌、"
    }
    if (checkOption(formatResult, 6, ["R"])) {
        str += "皮肤癌、"
    }
    if (checkOption(formatResult, 6, ["S"])) {
        str += "恶性肿瘤、"
    }
    if (checkOption(formatResult, 8, ["A", "B", "C", "D"])) {
        str += "药物过敏、"
    }
    if (checkOption(formatResult, 8, ["E", "F", "G"])) {
        str += "食物过敏、"
    }
    if (checkOption(formatResult, 8, ["H"])) {
        str += "花粉或尘螨过敏、"
    }
    if (checkOption(formatResult, 8, ["I"])) {
        str += "粉尘过敏、"
    }
    if (checkOption(formatResult, 8, ["J"])) {
        str += "洗洁剂过敏、"
    }
    if (checkOption(formatResult, 8, ["K"])) {
        str += "化妆品过敏、"
    }
    if (checkOption(formatResult, 8, ["l"])) {
        str += "过敏史、"
    }
    if (checkOption(formatResult, 9, ["A"])) {
        str += "长期用药史、"
    }
    if (checkOption(formatResult, 15, ["A"])) {
        str += "头颅手术史、"
    }
    if (checkOption(formatResult, 15, ["B"])) {
        str += "眼部手术史、"
    }
    if (checkOption(formatResult, 15, ["C"])) {
        str += "耳鼻咽喉部手术史、"
    }
    if (checkOption(formatResult, 15, ["D"])) {
        str += "颌面部及口腔部手术史、"
    }
    if (checkOption(formatResult, 15, ["E"])) {
        str += "颈部或甲状腺手术史、"
    }
    if (checkOption(formatResult, 15, ["F"])) {
        str += "胸部手术史、"
    }
    if (checkOption(formatResult, 15, ["G"])) {
        str += "心脏手术史、"
    }
    if (checkOption(formatResult, 15, ["H"])) {
        str += "外周血管手术史、"
    }
    if (checkOption(formatResult, 15, ["I"])) {
        str += "胃肠手术史、"
    }
    if (checkOption(formatResult, 15, ["J"])) {
        str += "肝胆手术史、"
    }
    if (checkOption(formatResult, 15, ["K"])) {
        str += "肾脏手术史、"
    }
    if (checkOption(formatResult, 15, ["L"])) {
        str += "脊柱手术史、"
    }
    if (checkOption(formatResult, 15, ["M"])) {
        str += "四肢及关节手术史、"
    }
    if (checkOption(formatResult, 15, ["N"])) {
        str += "膀胱手术史、"
    }
    if (checkOption(formatResult, 15, ["O"])) {
        str += "妇科手术史、"
    }
    if (checkOption(formatResult, 15, ["P"])) {
        str += "乳腺手术史、"
    }
    if (checkOption(formatResult, 15, ["Q"])) {
        str += "前列腺手术史、"
    }
    if (checkOption(formatResult, 15, ["R"])) {
        str += "手术史、"
    }
    if (checkOption(formatResult, 24, ["A"])) {
        str += "妊娠糖尿病史、"
    }
    if (checkOption(formatResult, 25, ["A"])) {
        str += "妊娠高血压史、"
    }
    if (checkOption(formatResult, 89, ["B", "C", "D", "E", "F", "G", "H", "I"])) {
        str += "长期环境污染暴露、"
    }
    str = str.substring(0, str.length - 1);
    let info = "";
    switch (level) {
        case 1:
            info = "根据您填写的问卷结果，您目前不存在不良健康史，请您继续保持！";
            break;
        case 2:
            info = `根据您填写的问卷结果，您存在一些不良健康史，包括：${str}，请您重点关注，定期检查。`;
            break;
        case 3:
            info = `根据您填写的问卷结果，您存在一些不良健康史，包括：${str}，请您重点关注，定期检查。`;
            break;
        case 4:
            info = `您存在很多的不良健康史：${str}，这些不良健康史可能会对您现在或将来的健康状况造成一定的影响，建议您关注身体指标变化，定期体检。`;
            break;
        case 5:
            info = `您存在很多的不良健康史：${str}，这些不良健康史可能会对您现在或将来的健康状况造成一定的影响，建议您关注身体指标变化，定期体检。`;
    }

    return info;
}

function symptoms(formatResult, level) {

    let str = "";
    if (checkOption(formatResult, 27, ["B", "C"])) {
        str += "疲劳乏力、"
    }
    if (checkOption(formatResult, 28, ["B", "C"])) {
        str += "视力下降、"
    }
    if (checkOption(formatResult, 27, ["B", "C"])) {
        str += "听力下降、"
    }
    if (checkOption(formatResult, 30, ["B", "C"])) {
        str += "鼻出血或浓血涕、"
    }
    if (checkOption(formatResult, 31, ["B", "C"])) {
        str += "吞咽不适、哽噎感、"
    }
    if (checkOption(formatResult, 32, ["B", "C"])) {
        str += "咳嗽、咳痰、"
    }
    if (checkOption(formatResult, 33, ["B", "C"])) {
        str += "咳痰带血或咯血、"
    }
    if (checkOption(formatResult, 34, ["B", "C"])) {
        str += "胸痛或心前区憋闷不适、"
    }
    if (checkOption(formatResult, 35, ["B", "C"])) {
        str += "胸闷气喘或呼吸困难、"
    }
    if (checkOption(formatResult, 36, ["B", "C"])) {
        str += "低热、"
    }
    if (checkOption(formatResult, 37, ["B", "C"])) {
        str += "头晕或头昏、"
    }
    if (checkOption(formatResult, 38, ["B", "C"])) {
        str += "恶心、反酸或上腹部不适、"
    }
    if (checkOption(formatResult, 39, ["B", "C"])) {
        str += "食欲不振、消化不良或腹胀、"
    }
    if (checkOption(formatResult, 40, ["B", "C"])) {
        str += "不明原因跌倒或晕倒、"
    }
    if (checkOption(formatResult, 41, ["B", "C"])) {
        str += "手足发麻或刺痛、"
    }
    if (checkOption(formatResult, 42, ["B", "C"])) {
        str += "下肢水肿、"
    }
    if (checkOption(formatResult, 43, ["B", "C"])) {
        str += "排尿困难、"
    }
    if (checkOption(formatResult, 44, ["B", "C"])) {
        str += "尿频、尿急、尿痛、尿血、"
    }
    if (checkOption(formatResult, 45, ["B", "C"])) {
        str += "腹泻、腹痛或大便习惯改变、"
    }
    if (checkOption(formatResult, 46, ["B", "C"])) {
        str += "柏油样便或便中带血、"
    }
    if (checkOption(formatResult, 47, ["A"])) {
        str += "不明原因体重减轻、"
    }
    if (checkOption(formatResult, 48, ["A"])) {
        str += "乳房胀痛、有包块、"
    }
    if (checkOption(formatResult, 49, ["A"])) {
        str += "阴道出血、白带异常、"
    }
    if (checkOption(formatResult, 51, ["A"])) {
        str += "头痛、"
    }
    if (checkOption(formatResult, 51, ["B"])) {
        str += "颈肩痛 、"
    }
    if (checkOption(formatResult, 51, ["C"])) {
        str += "咽喉痛、"
    }
    if (checkOption(formatResult, 51, ["D"])) {
        str += "腰背痛、"
    }
    if (checkOption(formatResult, 51, ["E"])) {
        str += "胸痛 、"
    }
    if (checkOption(formatResult, 51, ["F"])) {
        str += "腹痛、"
    }
    if (checkOption(formatResult, 51, ["G"])) {
        str += "四肢痛、"
    }
    if (checkOption(formatResult, 51, ["H"])) {
        str += "关节肿痛、"
    }
    str = str.substring(0, str.length - 1);
    let info = "";
    switch (level) {
        case 1:
            info = "您目前没有不适症状，请继续保持。";
            break;
        case 2:
            info = `您存在如下躯体不适：${str}，请您重点关注。`;
            break;
        case 3:
            info = `您存在如下躯体不适：${str}，请您重点关注。`;
            break;
        case 4:
            info = `您存在如下躯体不适：${str}，请您重点关注。`;
            break;
        case 5:
            info = `您存在如下躯体不适：${str}，请您重点关注。`;
            break;

    }
    return info;

}

function habits(formatResult, level) {
    let str = "";
    if (checkOption(formatResult, 52, ["C"])) {
        str += "三餐不规律、"
    }
    if (checkOption(formatResult, 53, ["C"])) {
        str += "常吃夜宵、"
    }
    if (checkOption(formatResult, 54, ["A"])) {
        str += "常暴饮暴食、"
    }
    if (checkOption(formatResult, 55, ["C", "D"])) {
        str += "常在外就餐、"
    }
    if (checkOption(formatResult, 56, ["B"])) {
        str += "膳食高盐、"
    }
    if (checkOption(formatResult, 57, ["A"])) {
        str += "常吃熏制、腌制类食物、"
    }
    if (checkOption(formatResult, 57, ["B"]) && checkOption(formatResult, 65, ["C"])) {
        str += "高脂饮食、"
    }
    if (checkOption(formatResult, 57, ["C"])) {
        str += "高糖饮食、"
    }
    if (checkOption(formatResult, 57, ["D"])) {
        str += "辛辣饮食、"
    }
    if (checkOption(formatResult, 57, ["E"])) {
        str += "热烫饮食、"
    }
    if (checkOption(formatResult, 57, ["F"])) {
        str += "爱吃零食、"
    }
    if (checkOption(formatResult, 57, ["G"])) {
        str += "爱吃快餐、"
    }
    if (checkOption(formatResult, 58, ["A", "C"])) {
        str += "主食结构不合理、"
    }
    if (checkOption(formatResult, 59, ["A", "B"])) {
        str += "牛奶摄入不足、"
    }
    if (checkOption(formatResult, 60, ["A", "B"])) {
        str += "蛋类摄入不足、"
    }
    if (checkOption(formatResult, 61, ["A"])) {
        str += "豆制品摄入不足、"
    }
    if (checkOption(formatResult, 62, ["A", "B"])) {
        str += "水果摄入不足、"
    }
    if (checkOption(formatResult, 63, ["A"])) {
        str += "蔬菜摄入不足、"
    }
    if (checkOption(formatResult, 64, ["A"])) {
        str += "动物蛋白摄入不足、"
    }
    if (checkOption(formatResult, 64, ["C", "D"])) {
        str += "红肉摄入过多、"
    }
    if (checkOption(formatResult, 65, ["C"])) {
        str += "爱吃肥肉、"
    }
    if (checkOption(formatResult, 66, ["C"])) {
        str += "动物内脏摄入过多、"
    }
    if (checkOption(formatResult, 67, ["C"])) {
        str += "海鲜摄入过多、"
    }
    if (checkOption(formatResult, 68, ["C", "D"])) {
        str += "常喝咖啡、"
    }
    if (checkOption(formatResult, 69, ["C", "D"])) {
        str += "常喝果汁或碳酸饮料、"
    }
    if (checkOption(formatResult, 70, ["B"]) && checkOption(formatResult, 71, ["A"]) && checkOption(formatResult, 72, ["A"])) {
        str += "吸烟、"
    }
    if (checkOption(formatResult, 70, ["B"]) && checkOption(formatResult, 71, ["A"]) && checkOption(formatResult, 72, ["B", "C", "D"])) {
        str += "吸烟，且烟龄较长、"
    }
    if (checkOption(formatResult, 70, ["B"]) && checkOption(formatResult, 71, ["B", "C", "D"]) && checkOption(formatResult, 72, ["A"])) {
        str += "吸烟，且吸烟量较大、"
    }
    if (checkOption(formatResult, 70, ["B"]) && checkOption(formatResult, 71, ["B", "C", "D"]) && checkOption(formatResult, 72, ["B", "C", "D"])) {
        str += "长期大量吸烟、"
    }
    if (checkOption(formatResult, 70, ["C"]) && checkOption(formatResult, 71, ["B", "C", "D"]) && checkOption(formatResult, 72, ["B", "C", "D"]) && checkOption(formatResult, 73, ["A"])) {
        str += "戒烟时间较短，戒烟前长期大量吸烟、"
    }
    if (checkOption(formatResult, 70, ["D"])) {
        str += "经常被动吸烟、"
    }
    if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 76, ["A"]) && checkOption(formatResult, 77, ["A"]) && checkOption(formatResult, 78, ["A"])) {
        str += "适量喝酒、"
    }
    if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 76, ["A"]) && checkOption(formatResult, 77, ["A"]) && checkOption(formatResult, 78, ["B", "C", "D"])) {
        str += "长期喝酒，但酒量不大、"
    }
    if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 76, ["B", "C"]) && checkOption(formatResult, 77, ["A"]) && checkOption(formatResult, 78, ["A"])) {
        str += "经常喝酒，但酒量不大、"
    }
    if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 76, ["B", "C"]) && checkOption(formatResult, 77, ["A"]) && checkOption(formatResult, 78, ["B", "C", "D"])) {
        str += "长期喝酒，但酒量不大、"
    }
    if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 76, ["A"]) && checkOption(formatResult, 77, ["B", "C"]) && checkOption(formatResult, 78, ["B", "C", "D"])) {
        str += "喝酒、"
    }
    if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 76, ["A"]) && checkOption(formatResult, 77, ["B", "C"]) && checkOption(formatResult, 78, ["A"])) {
        str += "喝酒、"
    }
    if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 76, ["B", "C"]) && checkOption(formatResult, 77, ["B", "C"]) && checkOption(formatResult, 78, ["A"])) {
        str += "经常大量饮酒、"
    }
    if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 76, ["B", "C"]) && checkOption(formatResult, 77, ["B", "C"]) && checkOption(formatResult, 78, ["B", "C", "D"])) {
        str += "长期过量饮酒、"
    }
    if (checkOption(formatResult, 74, ["C"])) {
        str += "已戒酒、"
    }
    if (checkOption(formatResult, 76, ["B", "C"]) && checkOption(formatResult, 77, ["B", "C"]) && checkOption(formatResult, 78, ["B", "C", "D"]) && checkOption(formatResult, 79, ["A"])) {
        str += "戒酒时间短，戒酒前长期过量饮酒、"
    }
    if (checkOption(formatResult, 76, ["B", "C"]) && checkOption(formatResult, 77, ["B", "C"]) && checkOption(formatResult, 78, ["B", "C", "D"]) && checkOption(formatResult, 79, ["B", "C", "D"])) {
        str += "戒酒前长期过量饮酒、"
    }
    if (checkOption(formatResult, 80, ["A"])) {
        str += "体力活动不足、"
    }
    if (checkOption(formatResult, 80, ["B"]) && checkOption(formatResult, 82, ["A"]) && checkOption(formatResult, 83, ["A"]) && checkOption(formatResult, 84, ["A"])) {
        str += "体力活动不足、"
    }
    if (checkOption(formatResult, 85, ["A"]) && checkOption(formatResult, 86, ["C"]) && checkOption(formatResult, 87, ["C", "D"])) {
        str += "静坐生活方式、"
    }
    if (checkOption(formatResult, 88, ["C", "D"])) {
        str += "静坐生活方式、"
    }
    str = str.substring(0, str.length - 1);
    let info = "";
    switch (level) {
        case 1:
            info = "您有着良好的生活习惯和方式，注重膳食营养搭配，也无不良嗜好，请您继续保持！";
            break;
        case 2:
            info = `您存在一些不良生活习惯，包括：${str}。这些不良生活习惯可能会对您的健康造成一定的影响，请您尽量改变。`;
            break;
        case 3:
            info = `您存在一些不良生活习惯，包括：${str}。这些不良生活习惯可能会对您的健康造成一定的影响，请您尽量改变。`;
            break;
        case 4:
            info = `您存较多的不良生活习惯或嗜好，包括：${str}。这些不良生活习惯和嗜好会对您的健康造成很大的影响，请您立即着手改变。`;
            break;
        case 5:
            info = `您存较多的不良生活习惯或嗜好，包括：${str}。这些不良生活习惯和嗜好会对您的健康造成很大的影响，请您立即着手改变。`;
            break;

    }

    return info;


}

function pressure(formatResult, level) {
    let str = "";
    if (checkOption(formatResult, 90, ["B", "C"])) {
        str += "情绪低落、"
    }
    if (checkOption(formatResult, 91, ["B", "C"])) {
        str += "容易激动和生气、"
    }
    if (checkOption(formatResult, 92, ["B", "C"])) {
        str += "精神紧张、"
    }
    if (checkOption(formatResult, 93, ["B", "C"])) {
        str += "容易着急、"
    }
    if (checkOption(formatResult, 94, ["B", "C"])) {
        str += "爱发脾气、"
    }
    if (checkOption(formatResult, 95, ["B", "C"])) {
        str += "心力枯竭、缺乏热情、"
    }
    if (checkOption(formatResult, 96, ["B", "C"])) {
        str += "焦虑、"
    }
    if (checkOption(formatResult, 97, ["B", "C"])) {
        str += "压抑、沮丧、"
    }
    if (checkOption(formatResult, 98, ["B", "C"])) {
        str += "注意力难以集中、"
    }
    str = str.substring(0, str.length - 1);
    let info = "";
    switch (level) {
        case 1:
            info = "您的心理健康状况良好，精神压力很小。";
            break;
        case 2:
            info = "您的心理健康状况较好，您的精神压力较小。";
            break;
        case 3:
            info = `您存在一定的精神压力，主要表现为：${str}。`;
            break;
        case 4:
            info = `您的精神压力较大，主要表现为：${str}。`;
            break;
        case 5:
            info = `您的精神压力很大，主要表现为：${str}。`;
            break;
    }
    return info;

}

function qualityOfSleep(formatResult, level) {
    let str = "";

    if (checkOption(formatResult, 100, ["A"])) {
        str += "入睡困难、";
    }
    if (checkOption(formatResult, 100, ["B"])) {
        str += "早醒、";
    }
    if (checkOption(formatResult, 100, ["C"])) {
        str += "多梦或噩梦中惊醒、";
    }
    if (checkOption(formatResult, 100, ["D"])) {
        str += "夜起、";
    }
    if (checkOption(formatResult, 100, ["E"])) {
        str += "熟睡时间短、";
    }
    if (checkOption(formatResult, 101, ["A"])) {
        str += "工作压力大、";
    }
    if (checkOption(formatResult, 101, ["B"])) {
        str += "负性生活事件、";
    }
    if (checkOption(formatResult, 101, ["C"])) {
        str += "环境不安静、";
    }
    if (checkOption(formatResult, 101, ["D"])) {
        str += "身体不舒服、";
    }
    if (checkOption(formatResult, 101, ["E"])) {
        str += "气候变化不适应、";
    }
    if (checkOption(formatResult, 101, ["F"])) {
        str += "服用药物、";
    }
    if (checkOption(formatResult, 101, ["G"])) {
        str += "倒班或倒时差、";
    }
    str = str.substring(0, str.length - 1);
    let info = "";
    switch (level) {
        case 1:
            info = "您的睡眠质量很好。";
            break;
        case 2:
            info = "您的睡眠质量很好。";
            break;
        case 3:
            info = `您的睡眠质量一般，影响您睡眠的主要原因包括: ${str}。`;
            break;
        case 4:
            info = `您的睡眠质量较差，影响您睡眠的主要原因包括: ${str}。`;
            break;
        case 5:
            info = `您的睡眠质量很差，影响您睡眠的主要原因包括: ${str}。`;
            break;
    }
    return info;


}

function literacy(level) {
    let info = "";
    switch (level) {
        case 1:
            info = "健康素养，是指个体获取和理解基本健康信息和服务，并运用这些信息和服务做出正确的决策，以维护和促进自身健康的能力。您有很好的健康素养。";
            break;
        case 2:
            info = "健康素养，是指个体获取和理解基本健康信息和服务，并运用这些信息和服务做出正确的决策，以维护和促进自身健康的能力。您的健康素养较好。";
            break;
        case 3:
            info = "健康素养，是指个体获取和理解基本健康信息和服务，并运用这些信息和服务做出正确的决策，以维护和促进自身健康的能力。您的健康素养一般，请您加强健康知识的学习和储备！";
            break;
        case 4:
            info = "健康素养，是指个体获取和理解基本健康信息和服务，并运用这些信息和服务做出正确的决策，以维护和促进自身健康的能力。您的健康素养较差，请您积极学习健康基础知识，掌握健康基本技能！";
            break;
        case 5:
            info = "健康素养，是指个体获取和理解基本健康信息和服务，并运用这些信息和服务做出正确的决策，以维护和促进自身健康的能力。您的健康素养很差，请您积极学习健康基础知识，掌握健康基本技能！";
            break;

    }
    return info;
}


/**
 * 计算某个纬度中某些题的得分合。
 * @param formatResult
 * @param sectionName
 * @param questionArray
 * @param questionnaireId
 * @returns {number}
 */
async function cal(formatResult, sectionName, questionArray, questionnaireId) {

    let rule = await srService.findOne({questionnaireId: questionnaireId, section: sectionName, isDelete: false});
    let score = 0;
    _.forEach(rule.rules, function (v) {
        if (questionArray.indexOf(v.questionSer) > -1){
            _.forEach(v.options, function (v1) {
                if (formatResult[v.questionSer] && formatResult[v.questionSer].indexOf(v1.optionTag) > -1) {
                    score += parseFloat(v1.weight) * parseFloat(v1.score)
                }
            });
        }
    });
    return score * questionArray.length;
}

/**
 * 根据答案生成各个风险及对应建议。
 * @param formatResult
 * @param cardInfo
 * @param result
 * @returns {{}}
 */
function generateAdviceContent(formatResult, cardInfo, result) {
    //TODO:完成根据结果生成内容的方法
    let risk = {};
    risk.r1 = {};
    risk.r1.No = "1";
    risk.r1.risk = "年龄";
    risk.r1.ideal = "随着年龄风险提高";
    risk.r1.result = cardInfo.age;
    risk.r1.advice = "--";


    risk.r2 = {};
    risk.r2.No = "2";
    risk.r2.risk = "体重指数(BMI)";
    risk.r2.ideal = "18.5-23.9";
    risk.r2.result = (cardInfo.weight / Math.pow(cardInfo.height/100, 2)).toFixed(2);
    if (risk.r2.result < 18.5 || risk.r2.result > 23.9){
        risk.r2.color = "red";
    }
    risk.r2.advice = "--";


    risk.r3 = {};
    risk.r3.No = "3";
    risk.r3.risk = "饮食习惯";
    risk.r3.ideal = "良好";
    if (checkOption(formatResult, 55, ["A"])) {
        risk.r3.result = "饮食习惯良好";
        risk.r3.advice = "继续保持";
    } else if (checkOption(formatResult, 55, ["B"])) {
        risk.r3.result = "饮食习惯一般";
        risk.r3.advice = "调节饮食习惯";
    } else if (checkOption(formatResult, 55, ["C", "D"])) {
        risk.r3.result = "饮食习惯不良";
        risk.r3.advice = "尽快调节饮食习惯，减少在外就餐次数";
        risk.r3.color = "red";
    }else {
        risk.r3.result = "--";
        risk.r3.advice = "--";
    }


    risk.r4 = {};
    risk.r4.No = "4";
    risk.r4.risk = "饮食口味";
    risk.r4.ideal = "清淡";
    if (checkOption(formatResult, 56, ["A"])) {
        risk.r4.result = "清淡";
        risk.r4.advice = "继续保持";
    } else if (checkOption(formatResult, 56, ["B"]) || checkOption(formatResult, 57, ["A"])) {
        risk.r4.result = "膳食高盐";
        risk.r4.advice = "减少钠盐摄入";
        risk.r4.color = "red";
    } else if (checkOption(formatResult, 56, ["C"])) {
        risk.r4.result = "口味一般";
        risk.r4.advice = "清淡饮食";
    }else {
        risk.r4.result = "--";
        risk.r4.advice = "--";
    }


    risk.r5 = {};
    risk.r5.No = "5";
    risk.r5.risk = "饮酒状况";
    risk.r5.ideal = "不饮酒或少量饮酒";
    if (checkOption(formatResult, 74, ["A"])) {
        risk.r5.result = "不饮酒";
        risk.r5.advice = "继续保持";
    } else if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 77, ["A"])) {
        risk.r5.result = "少量饮酒";
        risk.r5.advice = "继续保持";
    } else if (checkOption(formatResult, 74, ["B"]) && checkOption(formatResult, 77, ["B", "C"])) {
        risk.r5.result = "过量饮酒";
        risk.r5.advice = "控制饮酒量";
        risk.r5.color = "red";
    } else if (checkOption(formatResult, 74, ["C"])) {
        risk.r5.result = "已戒酒";
        risk.r5.advice = "继续保持";
    }else {
        risk.r5.result = "--";
        risk.r5.advice = "--";
    }


    risk.r6 = {};
    risk.r6.No = "6";
    risk.r6.risk = "吸烟状况";
    risk.r6.ideal = "不吸烟,无被动吸烟";
    if (checkOption(formatResult, 70, ["A"])) {
        risk.r6.result = "不吸烟";
        risk.r6.advice = "继续保持";
    } else if (checkOption(formatResult, 70, ["B"])) {
        risk.r6.result = "吸烟";
        risk.r6.advice = "戒烟";
        risk.r6.color = "red";
    } else if (checkOption(formatResult, 70, ["C"])) {
        risk.r6.result = "已戒烟";
        risk.r6.advice = "继续保持";
    } else if (checkOption(formatResult, 70, ["D"])) {
        risk.r6.result = "经常被动吸烟";
        risk.r6.advice = "远离二手烟";
        risk.r6.color = "red";
    }else{
        risk.r6.result = "--";
        risk.r6.advice = "--";
    }


    risk.r7 = {};
    risk.r7.No = "7";
    risk.r7.risk = "运动锻炼情况";
    risk.r7.ideal = "每周锻炼 ≧3 次";
    if (checkOption(formatResult, 80, ["A"])) {
        risk.r7.result = "运动锻炼不足";
        risk.r7.advice = "加强体育锻炼";
    } else if (checkOption(formatResult, 80, ["B"]) && checkOption(formatResult, 82, ["A"]) && checkOption(formatResult, 83, ["A"])) {
        risk.r7.result = "运动锻炼不足";
        risk.r7.advice = "加强运动锻炼";
        risk.r7.color = "red";
    } else if (checkOption(formatResult, 80, ["B"]) && checkOption(formatResult, 82, ["B"]) && checkOption(formatResult, 83, ["B"])) {
        risk.r7.result = "运动锻炼情况中等";
        risk.r7.advice = "继续加强运动锻炼";
    } else if (checkOption(formatResult, 80, ["B"]) && checkOption(formatResult, 82, ["C"]) && checkOption(formatResult, 83, ["C"])) {
        risk.r7.result = "运动锻炼充足";
        risk.r7.advice = "继续保持";
    }else{
        risk.r7.result = "--";
        risk.r7.advice = "--";
    }


    risk.r8 = {};
    risk.r8.No = "8";
    risk.r8.risk = "高脂饮食";
    risk.r8.ideal = "无";
    if (checkOption(formatResult, 57, ["B"]) || checkOption(formatResult, 65, ["C"])) {
        risk.r8.result = "高脂饮食";
        risk.r8.advice = "合理膳食,降低热量";
        risk.r8.color = "red";
    } else if (checkOption(formatResult, 65, ["A", "B"])) {
        risk.r8.result = "非高脂饮食";
        risk.r8.advice = "继续保持";
    }else{
        risk.r8.result = "--";
        risk.r8.advice = "--";
    }


    risk.r9 = {};
    risk.r9.No = "9";
    risk.r9.risk = "精神压力";
    risk.r9.ideal = "无压力或压力适度";
    let pressure = _.find(result.section, function (o) {
        return o.sectionName === "心理健康"
    });
    switch (pressure.result.level) {
        case "1":
            risk.r9.result = "无压力";
            risk.r9.advice = "继续保持";
            break;
        case "2":
            risk.r9.result = "压力适中";
            risk.r9.advice = "继续保持";
            break;
        case "3":
            risk.r9.result = "有一定压力";
            risk.r9.advice = "注意调节";
            risk.r9.color = "red";
            break;
        case "4":
            risk.r9.result = "压力较大";
            risk.r9.advice = "注意减压";
            risk.r9.color = "red";
            break;
        case "5":
            risk.r9.result = "压力很大";
            risk.r9.advice = "减轻精神压力、保持心里平衡";
            risk.r9.color = "red";
            break;
    }


    risk.r10 = {};
    risk.r10.No = "10";
    risk.r10.risk = "精神疾病";
    risk.r10.ideal = "无";
    if (checkOption(formatResult, 5, ["Y"])) {
        risk.r10.result = "有";
        risk.r10.advice = "调节血糖";
        risk.r10.color = "red";
    } else {
        risk.r10.result = "无";
        risk.r10.advice = "继续保持";
    }


    risk.r11 = {};
    risk.r11.No = "11";
    risk.r11.risk = "静坐生活方式";
    risk.r11.ideal = "否";
    if ((checkOption(formatResult, 85, ["A"]) && checkOption(formatResult, 86, ["C"]) && checkOption(formatResult, 87, ["C", "D"]))
        || checkOption(formatResult, 88, ["C", "D"])) {
        risk.r11.result = "静坐生活方式";
        risk.r11.advice = "改变生活方式,运动起来";
        risk.r11.color = "red";
    } else if (checkOption(formatResult, 88, ["A", "B"])) {
        risk.r11.result = "非静坐生活方式";
        risk.r11.advice = "继续保持";
    }else {
        risk.r11.result = "--";
        risk.r11.advice = "--";
    }


    risk.r12 = {};
    risk.r12.No = "12";
    risk.r12.risk = "高血压家族史";
    risk.r12.ideal = "无";
    risk.r12.advice = "--";
    risk.r12.result = "无";
    if (checkOption(formatResult, 1, ["A"])) {
        risk.r12.result = "有";
        risk.r12.color = "red";
    }


    risk.r13 = {};
    risk.r13.No = "13";
    risk.r13.risk = "糖尿病家族史";
    risk.r13.ideal = "无";
    risk.r13.advice = "--";
    risk.r13.result = "无";
    if (checkOption(formatResult, 1, ["E"])) {
        risk.r13.result = "有";
        risk.r13.color = "red";
    }


    risk.r14 = {};
    risk.r14.No = "14";
    risk.r14.risk = "早发心血管病家族史";
    risk.r14.ideal = "无";
    risk.r14.advice = "--";
    risk.r14.result = "无";
    if (checkOption(formatResult, 1, ["C"])) {
        risk.r14.result = "有";
        risk.r14.color = "red";
    }


    risk.r15 = {};
    risk.r15.No = "15";
    risk.r15.risk = "血脂异常";
    risk.r15.ideal = "无";
    risk.r15.result = "无";
    risk.r15.advice = "继续保持";
    if (checkOption(formatResult, 5, ["W"])) {
        risk.r15.result = "有";
        risk.r15.advice = "调节血脂";
        risk.r15.color = "red";
    }


    risk.r16 = {};
    risk.r16.No = "16";
    risk.r16.risk = "糖尿病史/糖耐量受损或空腹血糖受损";
    risk.r16.ideal = "无";
    risk.r16.result = "无";
    risk.r16.advice = "继续保持";
    if (checkOption(formatResult, 5, ["V"])) {
        risk.r16.result = "糖调节受损";
        risk.r16.advice = "血糖定期检测";
        risk.r16.color = "red";
    }


    risk.r17 = {};
    risk.r17.No = "17";
    risk.r17.risk = "糖尿病史";
    risk.r17.ideal = "无";
    risk.r17.result = "无";
    risk.r17.advice = "继续保持";
    if (checkOption(formatResult, 5, ["F"])) {
        risk.r17.result = "有";
        risk.r17.advice = "调节血糖";
        risk.r17.color = "red";
    }


    risk.r18 = {};
    risk.r18.No = "18";
    risk.r18.risk = "高血压病史";
    risk.r18.ideal = "无";
    risk.r18.result = "无";
    risk.r18.advice = "继续保持";
    if (checkOption(formatResult, 5, ["V"])) {
        risk.r18.result = "有";
        risk.r18.advice = "调节血压";
        risk.r18.color = "red";
    }


    if(cardInfo.gender === "女"){
        risk.r19 = {};
        risk.r19.No = "19";
        risk.r19.risk = "妊娠糖尿病";
        risk.r19.ideal = "无";
        risk.r19.result = "无";
        if (checkOption(formatResult, 24, ["A"])) {
            risk.r19.result = "有";
            risk.r19.color = "red";
        }
        risk.r19.advice = "--";
    }

    return risk;

}

function genContentByScore(contentRules,sectionName,score) {
    let rules = _.find(contentRules, function (cr) {
        return cr.section === sectionName
    });
    return _.find(rules.levels, function (level) {
        return level.minScore <= score && level.maxScore > score;
    });
}
