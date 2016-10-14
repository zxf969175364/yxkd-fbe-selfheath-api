/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 角色类型model
 */


module.exports = {
    attributes: {
        typeName: {type: 'string', required: true},     //角色类型名称：代理商、医院、科室
        permissions:{type:'array', required:true}        //权限，某种角色类型可以选择的权限，可以访问的url
    }
};

// permissions 数据格式
/*
[{
    permissionName:{type:'string',required:true},
    permissionUrls:{type:'array'}                       //权限对应的urls
}]*/
