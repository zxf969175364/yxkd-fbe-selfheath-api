/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 问卷model
 */
module.exports = {
    attributes:{
        questionnaireName:{type:'string', required:true},  //问卷名称
        mainTitle:{type:'string'},     //主标题
        subTitle:{type:'string'},                     //副标题
        section:{type:'array'},                     //array 结构见 注释一
        constrains:{type:'Array'},                       //限制条件
        description:{type:'string'},                  //描述
        isDelete:{type:'boolean', defaultsTo: false}
    }
};

//注释一
/* [{                                    //部分，名称、题目
 sectionName:{type:'string'},
 questions:[{                                  //题目  题目信息
 toIndex:{type:'string'},                 //下一题 
 index:{type:'string'},                  //每个题的编号，同时用于题目跳转
 questionId:{type:'string'},           //存问题的id
 questionType:{type:'string', required:true},  //问题类型  单选:SINGLE_CHOICE、多选:MULTI_CHOICE、填空:FILL_IN、判断:JUDGE、简答:SHORT_ANSWER
 questionName:{type:'string', required:true},  //题干
 gender:{type:'string'}                  //适用性别   FEMALE/MALE
 realAnswer:[],
 options:[{                                  //选项  选项名、图片、分值、建议
 optionTag:{type:'string'},          // A，B，C  1.2.3
 optionName:{type:'string'},
 gender:{type:'string'}                  //适用性别   FEMALE/MALE
 childPopUp: {type:'boolean'},          //true, 子题弹框
 childType: {type:'string'},             //子题类型   填空——"FILL_IN"
 imageUrl:{type:'string'},
 score:{type: 'integer'},                  //整数
 desc:{type:'json'},                  //问题选项描述 {title:'',content:''}
 suggestion:{type:'string'},             //生成评测报告是用到。
 toIndex:{type:'string'}                 //下一题,
 }],
 descInfo:{type:'json'},
 }]
 }]*/

//注释二
// constrains 数据结构
/*[
    {
        type:'gender',
        value:'MALE'
    },{
    type:'age',
    value:'20'
}
]*/
