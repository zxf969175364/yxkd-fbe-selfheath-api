/**
 * Created by zj on 16/6/3.
 */
import userDao from '../../../dao/hms/auth/user'
import userConst from '../../../utils/const/user_const';
import orgConst from  '../../../utils/const/organization_const';
import commConst from '../../../utils/common';
import orgService from '../organizations/organization';
import roleService from '../auth/role';
import roleTypeService from '../auth/role_type'


var crypto = require('crypto');

export default {
    /**
     * 添加用户
     * @param user
     */
    addUser: async function (user) {
        "use strict";
        //先检查用户是否存在
        let _user = userDao.findByName(user.userName);
        if (_user) {
            throw new Error('user Exist'); //这里需要在conts文件定义出错信息
        } else {
            return userDao.create(user)
        }
    },

    /**
     * 删除用户
     * @param userId
     */
    remove: async function (userId) {
        "use strict";
        let _user = userDao.findOne({id: userId});
        if (!_user) {
            throw new Error('user not Exist'); //这里需要在conts文件定义出错信息
        } else {
            return userDao.remove({id: userId}, {isDelete: true});
        }
    },

    mDelete: async function (array) {
        'use strict';
        let data = [];
        global._.forEach(array, function (v, k) {
            let tmp = {};
            tmp.id = v;
            tmp.isDelete = true;
            data.push(tmp);
        });
        return userDao.update(array, data);
    },

    /**
     * 修改用户信息，必须明确修改什么,在前端检查
     * @param query
     * @param user
     */
    update: async function (query, user) {
        "use strict";
        let _user = await userDao.findOne(query);
        if (!_user) {
            throw new Error(userConst.NO_PERMISS_OR_NO_USER); //这里需要在conts文件定义出错信息
        } else {
            return userDao.update(query, user)
        }
    },

    /**
     * 根据用户名查询用户
     * @param userName
     * @returns {*}
     */
    findByName: async function (userName) {
        "use strict";
        if (userName) {
            return userDao.findByName(userName.trim())
        } else {
            throw new Error('params invalid')
        }
    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        "use strict";
        return userDao.count(query)
    },
    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return userDao.findByQuery(query, paginates, orderby)
    },
    /**
     * 根据条件查询单个
     * @param query
     */
    findOne: async function (query) {
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return userDao.findOne(query)
    },

    findOneWithOrgInfo: async function (query) {
        "use strict";
        // query['isDelete'] = query['isDelete'] || false;
        let data = {};
        data.userInfo = await userDao.findOne(query);
        if (!!data.userInfo) {
            data.orgInfo = await orgService.findOne({id: data.userInfo.orgID});
        } else {
            throw new Error(userConst.NO_EXIST_USER);
        }
        return data;
    },


    addAccessUser: async function (data) {
        'use strict';
        if (data.password !== data.cfPassword){
            throw  new Error(userConst.CFM_PWD_ERROR);
        }
        let query = {userName: data.userName};
        let result = await userDao.findOne(query);
        if (!!result) {
            throw new Error(userConst.USER_NAME_EXIST);
        } else {
            return userDao.create(data);
        }
    },
    /**
     * data为创建组织管理员时必须的数据。
     * 包括，
     * 账户角色类型----roleType = data.type
     * 账户代理商ID-----agencyId = data.agencyId
     * 医院ID-----hospitalId = data.hospitalId
     * 体检中心ID-----centerId = data.centerId
     *
     * 用户名---- userName = data.userName || 6位随机数
     * 密码----- password = data.password || 6位随机数
     * 是否删除----isDelete = data.isDelete || false
     * 是否预置-----isPreset = data.isPreset || true
     * 是否启用-----isEnable = data.isEnable || false
     *
     *
     *
     * @param data
     */
    addOrganizationAdmin: async function (data) {
        'use strict';
        let info = {};
        if (!!data.roleType) {
            info.roleType = data.roleType;
        } else {
            throw new Error(userConst.NO_ROLE_TYPE)
        }
        info.agencyId = data.agencyId || "";
        info.hospitalId = data.hospitalId || "";
        info.centerId = data.centerId || "";
        if (!data.orgID) {
            throw new Error(userConst.NO_ORG_ID);
        }
        if (data.roleType === "AGENCY") {
            info.agencyId = data.orgID;
        }
        if (data.roleType === "HOSPITAL") {
            if (!data.agencyId) {
                throw new Error(userConst.NO_AGENCY_ID)
            }
            info.hospitalId = data.orgID;
        }
        if (data.roleType === "CENTER") {
            if (!data.agencyId) {
                throw new Error(userConst.NO_AGENCY_ID);
            }
            if (!data.hospitalId) {
                throw new Error(userConst.NO_HOSPITAL_ID);
            }
            info.centerId = data.orgID;
        }
        info.orgID = data.orgID;
        info.userID = Math.floor(Math.random() * 100000000);
        info.orgID = data.orgID;
        info.roleID = data.roleID;
        info.userName = data.userName || data.organizationId + "admin";
        // info.userName = data.userName || Math.floor(Math.random() * 100000000);
        info.password = data.password || "123456";              //创建组织时创建管理员帐号，默认密码为123456
        info.isDelete = data.isDelete || false;
        info.isPreset = data.isPreset || true;
        info.isEnable = data.isEnable || true;
        return userDao.create(info);
    },

    authCheck: async function (data) {
        let query = {userName: data.userName, isDelete: false};
        let userInfo = await userDao.findOne(query);
        let result = {};
        var inputsPwd = crypto.createHash('md5').update(data.password).digest('hex');
        if (!userInfo){
            throw new Error(userConst.NO_EXIST_USER);
        }else if (userInfo && inputsPwd === userInfo.password) {
            delete userInfo.password;
            if (userInfo.roleType === "SUADMIN") {
                result.userInfo = userInfo;
                let permissionInfo = await roleTypeService.findOne({typeName:'ADMIN'});
                result.permissions = permissionInfo.permissions;
            } else if (global._.indexOf(orgConst.ROLE, userInfo.roleType) > -1) {
                if (userInfo.roleType !== "ADMIN" && userInfo.roleType !== "SUADMIN" && !userInfo.orgID){
                    throw new Error(userConst.NO_ORG_INFO);
                }
                let permissionInfo = await roleService.findOne({id: userInfo.roleID, isDelete: false});
                if (permissionInfo){
                    result.permissions = permissionInfo.accessPermission;
                }
                let query={};
                switch (userInfo.roleType){
                    case "AGENCY":
                        query.or = [{id: userInfo.orgID, isDelete: false, isEnable: true}];
                        break;
                    case "HOSPITAL":
                        query.or = [{id: userInfo.agencyId, isDelete: false, isEnable: true}, {id: userInfo.orgID, isDelete: false, isEnable: true}];
                        break;
                    case "CENTER":
                        query.or = [
                            {id: userInfo.agencyId, isDelete: false, isEnable: true},
                            {id: userInfo.hospitalId, isDelete: false, isEnable: true},
                            {id: userInfo.orgID, isDelete: false, isEnable: true}
                        ]
                }
                if (query.or){
                    let orgsInfo = await orgService.find(query);
                    if (orgsInfo.length !== query.or.length){
                        throw new Error(userConst.NO_ORG_INFO);
                    }
                    // result.orgInfo = await orgService.findOne({id: userInfo.orgID, isDelete: false, isEnable:true});
                    result.orgInfo = _.find(orgsInfo, function (o) {
                        return o.roleType === userInfo.roleType
                    });
                }
                result.userInfo = userInfo;
            } else  {
                throw new Error(userConst.NO_ORG_INFO);
            }
        } else {
            throw new Error(userConst.AUTH_FAILED);
        }
        return result;

    },

    edit_pwd: async function (data) {

        let result = await this.authCheck(data);
        console.log(result);
        if (result.userInfo) {
            return this.update({id: result.userInfo.id}, {password: data.newPassword});
        }else{
            throw new Error(userConst.AUTH_FAILED)
        }

    },

    findWithRoleInfo: async function(query, paginates, orderby, session){
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        let userInfo = await userDao.find(query, paginates, orderby);
        let map = {};
        map.isDelete = false;
        switch(session.roleType){
            case "SUADMIN":
                map.roleType = "ADMIN";
                break;
            case "ADMIN":
                map.roleType = "ADMIN";
                break;
            case "AGENCY":
                map.agencyId = session.orgId;
                break;
            case "HOSPITAL":
                map.hospitalId = session.orgId;
                break;
            case "CENTER":
                map.centerId = session.orgId;
                break;

        }
        let roleInfo = await roleService.find(map);
        _.forEach(userInfo, function (v) {
            _.find(roleInfo, function (o) {
                if (v.roleID === o.id) {
                    v.roleName = o.roleName;
                }
            })
        });
        return userInfo;
    },

    delMutil: async function(idArray, session){
        let query = {id:idArray, isPreset:false};
        switch (session.roleType){
            case "AGENCY":
                query.agencyId = session.orgId;
                break;
            case "HOSPITAL":
                query.hospitalId = session.orgId;
                break;
            case "CENTER":
                query.centerId = session.orgId;
                break;
        }
        console.log(query);
        return this.update(query, {isDelete:true})
    },

    resetPassword: async function(query, session){
        if (!session || orgConst.ROLE.indexOf(session.roleType) == -1){
          throw  new Error("请求错误")
        }
        switch (session.roleType){
            case "ADMIN":

                break;
            case "AGENCY":
                query.agencyId = session.orgId;
                break;
            case "HOSPITAL":
                query.hospitalId = session.orgId;
                break;
            case "CENTER":
                query.centerId = session.orgId;
                break;
        }
        return this.update(query,{password:"123456"})
    }

}