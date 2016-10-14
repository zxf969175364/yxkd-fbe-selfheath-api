/**
 * Created by G on 2016/6/13 0013.
 * 测评卡model
 */

module.exports = {
    schema:true,
    attributes:{
        count:{type:'integer'},
        hospitalId:{type:'string' },          //医院id
        cardNumber:{type:'string',  unique:true}, //测评卡号
        agencyId:{type:'string' },            //代理商id
        centerId:{type:'string'},            //科室id
        batchId: { type: 'string' },             //批次id
        batchName:{type:'string'},           //批次名称
        customerId:{type:'string'},          //用户id
        questionnaireId:{type:'string'},     //问卷id
        questionnaireName:{type:'string'},   //问卷名称
        password:{type:'string'},            //密码
        checkArea:{type:'string'},           //体检区
        checkId: { type: 'string' },            //体检号
        budget: {type:'float'},                //预算
        // isVip:{type:'boolean'},                             //是否是VIP
        // isUsed:{type:'boolean', defaultsTo: false},            //是否使用
        // isFinished:{type:'boolean', defaultsTo:false},         //是否完成
        isDownload: { type: 'boolean', defaultsTo: false },         //是否下载
        isOrder: { type: 'boolean', defaultsTo: false },            //是否预约
        status:{type:'string', defaultsTo:'UNUSED'},
        finishSection:{type:'string',defaultsTo:'NOT_BEGIN'},      //答卷完成到章节
        nextSection:{type:'string'},
        nextNumber:{type:'integer'},
        //测评卡状态，可能的值 UNUSED->UNFINISHED->FINISHED
        //1.初始状态为UNUSED，
        //2.用户开始答题后变为UNFINISHED，
        //3.用户答题完成并通过审核变为FINISHED，

        downloadCount:{type:'boolean', defaultsTo:0},           //下载次数
        isChecked:{type:'boolean', defaultsTo:false},          //是否已经体检
        checkDate:{type:'date'},               //体检日期
        IDNumber:{type:'string', unique:true}, //身份证号(或者其他证件号)
        mobile:{type:'string'},                //手机号
        Tel:{type:'string'},                                  //座机号
        realName:{type:'string'},              //真实姓名
        gender:{type:'string'},                //性别
        age:{type:'string'},                                  //年龄
        height:{type:'string'},                               //身高
        weight:{type:'string'},                               //体重
        education:{type:'string'},                            //文化程度
        maritalStatus:{type:'string'},                        //婚姻状况
        nationality:{type:'string'},                          //民族
        medicare:{type:'string'},                             //医保类型
        company:{type:'string'},                              //工作单位
        occupation:{type:'string'},                           //职业
        followUpType:{type:'string'},                         //随访方式
        Email:{type:'string'},                                //邮箱
        province:{type:'string'},                           //省
        city:{type:'string'},                                //市
        emergencyName:{type:'string'},                      //紧急联系人姓名
        emergencyTel:{type:'string'},                       //紧急联系人电话
        emergencyEmail:{type:'string'},                        //紧急联系人邮箱
        familyAddress:{type:'string'},                         //家庭地址
        isPackage:{type:'boolean'},                             //是否制定套餐
        isOld:{type:'boolean', defaultsTo: false},           // 是否是老数据
        isDelete:{type:'boolean', defaultsTo: false}
    }
};

