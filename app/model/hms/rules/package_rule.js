/**
 * Created by zjp on 16/9/8.
 */


module.exports = {
    schema: true,
    attributes: {
        ruleName:{type:'string', required:true},        //规则名称
        centerId:{type:'string'},
        cases:{type:'array'},
        relation:{type:'json'},
        items:{type:'array'},
        idString:{type:'string'},
        isDelete:{type:'boolean', defaultsTo:false}
    }
};



/*
var conditions = {
    ruleName: "规则1",
    centerId: "**********",
    cases: [{ //该条件表示 1 问题选择 A
        "type": "questionResult", ////personalInfo/questionResult/questionnaireResult/indicator
        //如果 type 为 question 或 questionResult 则需添加questionnaireName 和 questionnaireId 字段
        "questionnaireName": "",
        "questionnaireId": "",
        "condition": "1"
        "relate": "=",
        "result": "A"
    }, { //该条件表示 年龄大于20
        "type": "personalInfo",
        "condition": "age",
        "relate": ">",
        "result": "20"
    }, { //该条件3 表示 某指标(血压、血糖 ……)大于50
        "type": "questionnaireResult",
        "questionnaireName": "",
        "questionnaireId": "",
        "condition": "*****",
        "relate": ">",
        "result": "50"
    }],
    items: [{
        categoryId: "******",
        itemId: "******",
        indicatorId: "*******",
        result:"4"
    }]
}//*/