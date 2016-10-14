/**
 * Created by zjp on 2016/7/5.
 * 得分规则model
 */


module.exports = {
    attributes: {
        questionnaireId: { type: 'string', required: true },
        questionnaireName:{type :'string'},          //问卷名称
        section:{type:'string', required:true},
        rules:{type:'array'}
        
    }
};


/*var rules = [
    {
        questionId:'w98534985',             //可以通过问题在题库总的id找到问题。
        index:'',                           //也可以通过问题在问卷中的index找到问题。        建议通过index到问卷总找问题。
        options:[                           //列举题目每个选项的分数及权重。
            {
                optionTag:"",               //选项标签：A,B,C
                optionName:"",              //选项的内容（包含选项标签）：A.肿瘤
                score:0.5,                   //该选项的基本分数
                weight:2                   //选项对应的权重。
            }
        ]
    }
]*/



