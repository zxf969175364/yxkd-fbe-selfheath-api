/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 用户model
 */

var crypto = require('crypto');


module.exports = {
    schema:true,
    attributes:{
        orgID:{type:"string"},
        roleType:{type:'string', required:true},            //角色类型：代理商、医院、科室
        roleID:{type:'string'},                               //角色ID
        agencyId:{type:'string'},              //代理商id，代理商用户必填,医院用户必填，科室用户必填
        hospitalId:{type:'string'},              //医院id，医院用户必填，科室用户必填
        centerId:{type:'string'},              //科室id，科室用户必填
        // IDNumber:{type:'string', required:true, unique:true}, //身份证号(或者其他证件号)
        userName:{type:'string', required:true},                //登录用用户名
        password:{type:'string'},                             //密码
        realName:{type:'string'},                               //真是姓名
        isDelete:{type:'boolean', defaultsTo: false},            //是否删除标记字段
        isPreset:{type:'boolean', defaultsTo: false},
        isEnable:{type:'boolean', defaultsTo: false}            //是否启用，默认不启用


        //ref : https://github.com/balderdashy/waterline-docs/blob/master/models/lifecycle-callbacks.md

        
    },
    beforeCreate: function (values, next){
        var password = values.password;
        if (password){
            values.password = crypto.createHash('md5').update(password).digest('hex');
        }
        next();

    },

    beforeUpdate: function (values, next){
        var password = values.password;
        if (password){
            values.password = crypto.createHash('md5').update(password).digest('hex');
        }
        next();

    }
};