/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 角色model
 */
module.exports = {
    attributes: {
        roleName: {type: 'string', required: true},	//角色名称
        roleType: {type: 'string', required: true},    //角色类型，保存角色类型名称：代理商、医院、科室
        agencyId:{type:'string'},                       //代理商ID  代理商、医院、科室必填
        hospitalId:{type:'string'},                     //医院ID    医院、科室必填
        centerId:{type:'string'},                       //科室ID    科室必填
        accessPermission: {type: 'array'},   //角色的权限，对应的权限名称和url。数据应该为roleType 中 permissions 的子集。
        isPreset:{type:'boolean', defaultsTo: false},      //角色是否预置
        isDelete: {type: 'boolean', defaultsTo: false}      //是否删除
    }
};

// accessPermission 数据格式
/*
 [{
 permissionName:{type:'string',required:true},
 permissionController:{type:'string'},
 permission
 permissionUrls:{type:'array'}                       //权限对应的urls
 }]*/