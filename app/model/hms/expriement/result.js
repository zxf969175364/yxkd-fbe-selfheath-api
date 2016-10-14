/**
 * Created by zhaojinpeng on 2016/6/14 0014.
 * 测评结果model
 */


module.exports = {
    schema:true,
    attributes: {
        // resultId:{type:'string',required:true},                //测评结果ID
        cardNumber:{type:'string'},                               //测评卡号
        cardId:{type:'string'},
        personalInfo:{type:'json'},                               //个人资料，参照个人资料结构
        isAgree:{type:'boolean',defaultsTo: false},               //是否同意协议
        questionnaireId:{type:'string',required:true},            //答卷ID
        questionnaireName:{type:'string',required:true},          //问卷名称
        agencyId:{type:'string', required:true},                  //代理商 ID
        hospitalId:{type:'string', required:true},                //医院 ID
        centerId:{type:'string', required:true},                  //体检中心 ID
        section:{type:'array'},                                   //答题结果集合
        //totalScore:{type:'float'},                                //结果总分
        finishSection:{type:'string',defaultsTo:'NOT_BEGIN'},     //完成到的章节
        nextSection:{type:'string'},
        nextNumber:{type:'integer'},
        summary:{type:'json'},
        isOld:{type:'boolean', defaultsTo: false},           // 是否是老数据
        isDelete:{type:'boolean', defaultsTo:false}
    }


};
//答题结果数据格式
/*
section:[{
        sectionName:'q',

        questions:[{
                index:'1',
                title:''
                answer:[{
                  disease:[{       //疾病
                    option:'',     //选项
                    score:10,      //得分
                    age:""         //年龄
                    cancer:[{
                      "option": "K.膀胱癌",
                      "score": 0
                    }]
                  }],
                  relation:'',   //亲属

                  option:'',     //选项
                  score:10,      //得分
                  age:""         //年龄

                }]
            }],

        result:{
            "score":0.8
            "level" : 5,
            "levelName" : "很差",
            "desc" : "我非常遗憾地告诉您，在我们的健康自测自评智能系统中，健康综合指数5级是最差的健康等级，表明您好存在太多不利于您身体健康的因素，您必须对您的健康问题引起足够的重视，调整您的生活方式和作息习惯，加强健康方面的关注和投入，希望您的身体状况更好！",
        }
    }]
*/

/*
summary:{
  score:'',
  level:2,
  levelName:'良好',
  desc:'这在我们的5级评价中属于相对比较好的综合健康等级，但同时也提醒您还存在一些足之处，希望您参阅本报告的后续干预措施，不断地将自身健康维护好。'
}*/
