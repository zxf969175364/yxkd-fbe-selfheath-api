/**
 * Created by zhaojinpeng on 2016/6/29.
 * 评测报告规则model
 */
module.export = {
    scheme:true,
    attributes: {
        questionnaireId: { type: 'string' },          //问卷ID
        questionnaireName:{type :'string'},          //问卷名称
        section:{type:'string'},                    //维度或疾病
        levels:{type:'array'}                       //对应数据格式看下方注视。

    }
};


//level 数据结构
/*
var obj = {
    min:0,                         //分值范围下限
    max:0.14,                         //分值范围上限
    level:1,                     //等级
    levelName:"优",                  //等级名称
    desc:"恭喜您！这代表您目前的健康状况很不错！不存在不良躯体症状或心理问题，精神压力适可，睡眠质量也还可以，生活方式和作息习惯相对比较优良，同时，您有良好的健康素养，具有丰富的健康知识，希望您继续保持。"                        //对应的文字解释
}*/
