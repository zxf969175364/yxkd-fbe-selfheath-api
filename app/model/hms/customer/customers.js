/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 客户model
 * 
 */


module.exports = {
    schema:true,
    attributes: {
        // customId:{type:'string', required:true, unique:true},
        // agencyId:{type:'string', required:true},              //代理商id
        // hospitalId:{type:'string', required:true},              //医院id
        // centerId:{type:'string', required:true},              //科室id
        IDNumber:{type:'string',  unique:true},             //身份证号(或者其他证件号)  required
        password:{type:'string'},                             //密码
        mobile:{type:'string'},                               //手机号   required:true
        Tel:{type:'string'},                                  //座机号
        realName:{type:'string'},              //真实姓名   , required:true
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
        city:{type:'string'},                               //市
        country:{type:'string'},                             //县
        address:{type:'string'},                            //家庭地址
        emergencyName:{type:'string'},                      //紧急联系人姓名
        emergencyTel:{type:'string'},                       //紧急联系人电话
        emergencyEmail:{type:'string'},                     //紧急联系人邮箱
        personalHistory:{type:'array'},                      //个人病史
        familyHistory:{type:'json'},                        //家族病史
        isOld:{type:'boolean', defaultsTo: false},          // 是否是旧数据
        isDelete:{type:'boolean', defaultsTo: false}
    }
};

/*familyHistory:[{
        relation:'',    //亲属
        disease:[{
            name:"",    //病症
            age:''      //患病时间
        }]
}]
*/


/*
personalHistory:{
 [
    type:"",
    disease:[{
        name:'',
        age:''
    }]
 }
 */

