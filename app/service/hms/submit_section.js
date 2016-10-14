/**
 * Created by zjp on 2016/7/5.
 */

import srService from './rules/score_rule';
import crService from './rules/content_rule';
import ruleConst from '../../utils/const/rule_const';

export default {

    calSectionScore: async function (data) {
        let rule = await srService.findOne({questionnaireId: data.questionnaireId, section: data.finishSection, isDelete:false});
        if (!!rule) {
            return await cal(rule, data);
        } else {
            throw new Error(ruleConst.NO_FIT_SCORE_RULE);
        }
    },

    contentViaScore: async function (data, score) {
        score = parseFloat(score);
        if (typeof score !== 'number'){
          throw new Error(ruleConst.CALCULATE_SCORE_ERROR)
        }
        let rules = await crService.findOne({questionnaireId: data.questionnaireId, section:data.finishSection, isDelete:false});
        let rule = _.find(rules.levels, function (level) {
            return level.minScore <= score && level.maxScore > score;
        });
        if (rule) {
            return rule;
        } else {
            throw new Error(ruleConst.NO_FIT_CONTENT_RULE);
        }
    }
}

function cal(rule, data) {
    let score = 0;
    //健康史结构比较特殊,暂时特殊处理。

    _.forEach(data.section[0].questions, function (qv) {
        if (qv.questionSer === '0'){
            let answers = [];
            //TODO 添加家族史的分值计算。

        }else {
            _.forEach(rule.rules, function (rv) {
                if (qv.questionSer === rv.questionSer) {
                    _.forEach(qv.answer, function (anv) {
                        _.forEach(rv.options, function (opv) {
                            if (anv.tag === opv.optionTag) {
                                score = score + parseFloat(opv.score) * parseFloat(opv.weight);
                            }
                        })
                    })
                }
            })
        }
    });
    score = parseFloat(score.toFixed(4));
    if (typeof score !== "number"){
        throw new Error(ruleConst.CALCULATE_SCORE_ERROR);
    }
    return score;
}

function buildQuery(data, score) {
    return {
        questionnaireId: data.questionnaireId,
        section: data.finishSection,
        maxScore: {">=": score},
        minScore: {"<=": score}
    };
}