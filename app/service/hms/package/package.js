/**
 * Created by zjp on 16/9/9.
 */

import packageDao from '../../../dao/hms/customer/package';
import packageConst from '../../../utils/const/package_const';
import cardService from '../assess/card';
import indicatorService from './package_indicator';
import resultService from '../result';
import reportService from '../report/report';
import packRuleService from '../rules/package_rule';
import categoryService from '../package/package_category';
import itemService from '../package/package_item';

export default {
    create: async function (data) {
        'use strict';
        let query = {id: data.centerId, isDelete: false};
        if (data.name){
            query.name = data.name;
        }
        // let query = {id: data.centerId, name: data.name, isDelete: false};
        let result = await packageDao.findOne(query);
        console.log(result);
        if (result) {
            throw new Error(packageConst.NAME_EXIST);
        }
        data.isDelete = data.isDelete || false;
        let pack = await packageDao.create(data);
        if (!data.isFixed) {
            await cardService.update({id: data.cardId}, {isPackage: true});
        }
        return pack;

    },

    count: async function (query) {
        'use strict';
        return packageDao.count(query);
    },

    find: async function (query) {
        'use strict';
        return packageDao.find(query);
    },

    findOne: async function (query) {
        'use strict';
        return packageDao.findOne(query);
    },

    findByQuery: async function (query, paginates, orderby) {
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return packageDao.findByQuery(query, paginates, orderby);
    },

    getRecommendedPackage: async function (cardId) {
        'use strict';
        let card_query = {id: cardId, isDelete: false};
        let cardInfo = await cardService.findOne(card_query);
        if (!cardInfo) {
            throw new Error('没有测评卡信息')
        }
        let centerId = cardInfo.centerId;
        let query = {centerId: cardInfo.centerId, isDelete: false};
        let indicators = await indicatorService.find(query);                // 获取科室下所有的可用指标


        let or_cond = [];
        _.forEach(indicators, function (v) {
            or_cond.push({idString: {'contains': v.id}});
            or_cond.push({idString: {'contains': v.associateId}})
        });                     //构建查询所有指标对应规则的查询语句。
        let rule_query = {};
        rule_query.centerId = ['SYSTEM', centerId];
        if (or_cond.length > 0) {
            rule_query.or = or_cond;
        }

        let rules = await packRuleService.find(rule_query);                 //获取需要的所有规则。
        let recommended_indicator = [];                                     //保存通过规则计算得到的所有指标，包括必查、必不查等
        for (let i = 0; i < rules.length; i++) {                               //计算所有指标结果。
            if (await check_rule(rules[i], cardInfo)) {
                recommended_indicator = _.concat(recommended_indicator, rules[i].items);
            }
        }

        let ids = [];                                                       //获取计算得到的所有指标的 ID
        _.forEach(recommended_indicator, function (v) {
            ids.push(v.indicatorId);
        });

        let uniqIds = _.uniq(ids);                                         //去重
        let rulesData = await indicatorService.find({id: uniqIds});         //获取计算得到的所有指标的数据。

        let withInData = [];

        _.forEach(rulesData, function (v) {                                //将得到的指标的数据修改 key id 为 indicatorId，方便后边合并
            withInData.push(_.mapKeys(v, function (v1, k) {
                    if (k === "id") {
                        return 'indicatorId';
                    } else {
                        return k;
                    }
                })
            )
        });

        _.forEach(recommended_indicator, function (v) {                    //将指标信息合并到计算得出的指标中。
            _.merge(v, _.find(withInData, function (o) {
                return v.indicatorId === o.indicatorId
            }));
        });

        let mustInd = [];           //必查指标
        let mustNotInd = [];        //必不查指标
        let scoreInd = [];          //推荐指标
        let mustNotIndId = [];      //必不查指标 ID

        _.forEach(recommended_indicator, function (v) {                    //讲指标按照是否必查，是否必不查，得分进行分组。得分项目直接合并计算分值。
            if (v.result === "必查") {
                mustInd.push(v);
            } else if (v.result === "必不查") {
                mustNotIndId.push(v.indicatorId);
                mustNotInd.push(v);
            } else {
                let tmp = _.findIndex(scoreInd, function (o) {
                    return o.indicatorId === v.indicatorId;
                });
                if (tmp >= 0) {
                    scoreInd[tmp].result += parseInt(v.result);
                } else {
                    scoreInd.push(v);
                }
            }
        });


        mustInd = _.filter(mustInd, function (o) {                      //排除必查项目中的必不查项目
            return mustNotIndId.indexOf(o.indicatorId) < 0;
        });

        scoreInd = _.filter(scoreInd, function (o) {                    //排除得分项目中的必不查项目。
            return mustNotIndId.indexOf(o.indicatorId) < 0;
        });

        scoreInd = _.filter(scoreInd, function (o) {                    //排除得分项目中的必查项目。
            return mustInd.indexOf(o.indicatorId) < 0;
        });

        let sortInd = _.orderBy(scoreInd, ['result'], ['desc']);         //对得分项目按照得分进行降序排序。

        let notRec = _.filter(indicators, function (o) {                //排除未推荐项目中的必不查项目。
            return ids.indexOf(o.id) < 0;
        });

        //TODO 这里添加根据预算调整推荐指标。

        let result = {};
        result.selected = mustInd;
        result.recommended = sortInd;
        result.not_recommended = notRec;
        return result;
    },


    /**
     * 按照树形结构返回科室内所有指标
     * @param cardId
     * @returns {Array}
     */
    getRecommendedPackageWithAllItems: async function (cardId) {

        let cardInfo = await cardService.findOne({id: cardId});
        let indicators = await indicatorService.find({centerId: cardInfo.centerId, isDelete: false});

        let recommendIndicators = await getRecommendedPackage2(cardId, indicators);

        console.log(recommendIndicators);

        let indexs = [];
        _.forEach(recommendIndicators.selected, function (v, k) {
            let index = _.findIndex(indicators, function (o) {
                return o.id === k.id;
            });
            indexs.push(index);
        });
        console.log(indicators);
        console.log(indexs);
        _.forEach(indexs, function (v) {
            indicators[v].selected = true;
        });

        let categoryGroup = _.groupBy(indicators, 'categoryId');
        let result = [];
        let categoryIds = [];
        let itemsIds = [];
        _.forEach(categoryGroup, function (v, k) {
            let ca = {};
            ca.categoryId = k;
            categoryIds.push(k);
            ca.array = [];
            let itemGroup = _.groupBy(v, 'itemId');
            _.forEach(itemGroup, function (v1, k1) {
                let it = {};
                it.itemId = k1;
                itemsIds.push(k1);
                it.array = v1;
                ca.array.push(it);
            });
            result.push(ca);
        });

        let categories = await categoryService.find(categoryIds);
        let items = await itemService.find(itemsIds);

        _.forEach(result, function (v) {
            let c = _.find(categories, function (o) {
                return v.categoryId === o.id;
            });
            v.name = c.categoryName;
            _.forEach(v.array, function (v2) {
                let i = _.find(items, function (o2) {
                    return v2.itemId === o2.id;
                });
                v2.isSplit = i.isSplit;
                v2.name = i.itemName;
            })
        });
        return result;
    }
}

async function check_rule(rule, cardInfo) {
    for (let i = 0; i < rule.cases.length; i++) {
        switch (rule.cases[i].type) {
            case 'personalInfo':
                if (!checkPersonalInfo(rule.cases[i], cardInfo)) {
                    return false;
                }
                break;
            case 'questionResult':
                let result = await resultService.findOne({
                    cardId: cardInfo.id,
                    questionnaireName: rule.cases[i].questionnaireName,
                    isDelete: false
                });
                if (!checkQuestion(rule.cases[i], result)) {
                    return false;
                }
                break;
            case 'questionnaireResult':
                let report = await reportService.findOne({
                    cardId: cardInfo.id,
                    questionnaireName: rule.cases[i].questionnaireName,
                    isDelete: false
                });
                if (!checkQuestionnaireResult(rule.cases[i], report)) {
                    return false;
                }
                break;
        }
    }

/*
    _.forEach(rule.cases, function (con) {
        let result = await resultService.findOne({cardId: cardInfo.id, questionnaireName: cardInfo.questionnaireName, isDelete: false})
        let report = await reportService.findOne({cardId: cardInfo.id, questionnaireName: cardInfo.questionnaireName, isDelete: false})
        switch (con.type) {
            case 'personalInfo':
                if (!checkPersonalInfo(con, cardInfo)) {
                    return false;
                }
                break;
            case 'question':
                if (!checkQuestion(con, result)) {
                    return false;
                }
                break;
            case 'questionnaireResult':
                if (!checkQuestionnaireResult(con, report)) {
                    return false;
                }
                break;
        }
    });
*/
    return true;
}

function checkQuestion(con, result) {
    return checkOption(result, con.condition, [con.result]);
}

function checkPersonalInfo(con, cardInfo) {
    switch (con.relate) {
        case '>':
            return cardInfo[con.condition] > con.result;
        case '>=':
            return cardInfo[con.condition] >= con.result;
        case '<':
            return cardInfo[con.condition] < con.result;
        case '<=':
            return cardInfo[con.condition] <= con.result;
        case '=':
            return cardInfo[con.condition] == con.result;
        case '≠':
            return cardInfo[con.condition] != con.result;
    }
}

function checkQuestionnaireResult(con, report) {
    let diseaseLevel = _.find(report.report.disease, function (o) {
        return o.diseaseName === con.condition;
    });
    switch (con.relate) {
        case '>':
            return diseaseLevel > con.result;
        case '>=':
            return diseaseLevel >= con.result;
        case '<':
            return diseaseLevel < con.result;
        case '<=':
            return diseaseLevel <= con.result;
        case '=':
            return diseaseLevel == con.result;
        case '≠':
            return diseaseLevel != con.result;

    }

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

async function getRecommendedPackage2(cardId, indicators) {
    'use strict';
    let card_query = {id: cardId, isDelete: false};
    let cardInfo = await cardService.findOne(card_query);
    if (!cardInfo) {
        throw new Error('没有测评卡信息')
    }
    let centerId = cardInfo.centerId;
    // let query = {centerId: cardInfo.centerId, isDelete: false};
    // let indicators = await indicatorService.find(query);                // 获取科室下所有的可用指标


    let or_cond = [];
    _.forEach(indicators, function (v) {
        or_cond.push({idString: {'contains': v.id}});
        or_cond.push({idString: {'contains': v.associateId}})
    });                     //构建查询所有指标对应规则的查询语句。
    let rule_query = {};
    rule_query.centerId = ['SYSTEM', centerId];
    if (or_cond.length > 0) {
        rule_query.or = or_cond;
    }

    let rules = await packRuleService.find(rule_query);                 //获取需要的所有规则。
    let recommended_indicator = [];                                     //保存通过规则计算得到的所有指标，包括必查、必不查等
    for (let i = 0; i < rules.length; i++) {                               //计算所有指标结果。
        if (await check_rule(rules[i], cardInfo)) {
            recommended_indicator = _.concat(recommended_indicator, rules[i].items);
        }
    }

    let ids = [];                                                       //获取计算得到的所有指标的 ID
    _.forEach(recommended_indicator, function (v) {
        ids.push(v.indicatorId);
    });

    let uniqIds = _.uniq(ids);                                         //去重
    let rulesData = await indicatorService.find({id: uniqIds});         //获取计算得到的所有指标的数据。

    let withInData = [];

    _.forEach(rulesData, function (v) {                                //将得到的指标的数据修改 key id 为 indicatorId，方便后边合并
        withInData.push(_.mapKeys(v, function (v1, k) {
                if (k === "id") {
                    return 'indicatorId';
                } else {
                    return k;
                }
            })
        )
    });

    _.forEach(recommended_indicator, function (v) {                    //将指标信息合并到计算得出的指标中。
        _.merge(v, _.find(withInData, function (o) {
            return v.indicatorId === o.indicatorId
        }));
    });

    let mustInd = [];           //必查指标
    let mustNotInd = [];        //必不查指标
    let scoreInd = [];          //推荐指标
    let mustNotIndId = [];      //必不查指标 ID

    _.forEach(recommended_indicator, function (v) {                    //讲指标按照是否必查，是否必不查，得分进行分组。得分项目直接合并计算分值。
        if (v.result === "必查") {
            mustInd.push(v);
        } else if (v.result === "必不查") {
            mustNotIndId.push(v.indicatorId);
            mustNotInd.push(v);
        } else {
            let tmp = _.findIndex(scoreInd, function (o) {
                return o.indicatorId === v.indicatorId;
            });
            if (tmp >= 0) {
                scoreInd[tmp].result += parseInt(v.result);
            } else {
                scoreInd.push(v);
            }
        }
    });


    mustInd = _.filter(mustInd, function (o) {                      //排除必查项目中的必不查项目
        return mustNotIndId.indexOf(o.indicatorId) < 0;
    });

    scoreInd = _.filter(scoreInd, function (o) {                    //排除得分项目中的必不查项目。
        return mustNotIndId.indexOf(o.indicatorId) < 0;
    });

    scoreInd = _.filter(scoreInd, function (o) {                    //排除得分项目中的必查项目。
        return mustInd.indexOf(o.indicatorId) < 0;
    });

    let sortInd = _.orderBy(scoreInd, ['result'], ['desc']);         //对得分项目按照得分进行降序排序。

    let notRec = _.filter(indicators, function (o) {                //排除未推荐项目中的必不查项目。
        return ids.indexOf(o.id) < 0;
    });

    //TODO 这里添加根据预算调整推荐指标。

    let result = {};
    result.selected = mustInd;
    result.recommended = sortInd;
    result.not_recommended = notRec;
    return result;
}