/**
 * Created by G on 2016/6/17 0017.
 */
// let orgDao = G.dao.load('organization');

import orgDao from '../../../dao/hms/organizations/organizations'
import userDao from '../../../dao/hms/auth/user'
import userService from '../../../service/hms/organizations/user'
import CONST from '../../../utils/const/organization_const'
import roleTypeService from '../auth/role_type'
import roleService from '../auth/role'

export default {
    addOrg: async function (data) {
        'use strict';
        return orgDao.addOrg(data);
    },


    /**
     * 更新组织信息，需要批量更新下级组织中对应的组织名称。
     * @param query
     * @param data
     * @returns {*}
     */
    updateOrg: async function (query, data) {
        'use strict';
        let exist = await orgDao.findOne(query);
        if (!!exist) {
            // let idType = sess.idType;
            // let nameType = sess.nameType;
            let chQuery = {};
            let chUpdate = {};
            switch (exist.roleType) {
                case 'AGENCY':
                    chQuery.agencyId = query.id;
                    chUpdate.agencyName = data.name;
                    break;
                case 'HOSPITAL':
                    chQuery.hospitalId = query.id;
                    chUpdate.hospitalName = data.name;
                    break;
                case 'CENTER':
                    chQuery.centerId = query.id;
                    chUpdate.centerName = data.name;
                    break;
            }

            let chExist = await orgDao.findOne(chQuery);
            if (!!chExist) {
                await orgDao.update(chQuery, chUpdate);
            }

            // // let chQuery = {};
            // chQuery[sess.idType] = query.id;
            // // let chUpdate = {};
            // chUpdate[sess.nameType] = data.name;

            // //更新子组织的上级组织名
            // let chOrg = orgDao.findOne(chQuery);
            // if (chOrg) {
            //     orgDao.update(chQuery, chUpdate);

            // }
            return orgDao.update(query, data);
        } else {
            throw new Error(CONST.ORG_NOT_EXIST);
        }
    },

    addAccessOrg: async function (data) {
        'use strict';
        let query = { organizationId: data.organizationId, isDelete: false };
        let result = await orgDao.findOne(query);
        if (!!result) {
            throw new Error(CONST.EXIST_ID)
        } else {
            let info = {};
            data.isEnable = true;
            info.orgInfo = await orgDao.addOrg(data);
            if (!!info.orgInfo) {
                data.orgID = info.orgInfo.id;
                // console.log(data);
                let permissionInfo = await roleTypeService.findOne({ typeName: data.roleType });
                // console.log(permissionInfo);
                let roleInfo = {};
                switch (data.roleType) {
                    case "AGENCY":
                        roleInfo = {
                            roleName: "代理商管理员",
                            agencyId: info.orgInfo.id,
                        };
                        break;
                    case "HOSPITAL":
                        roleInfo = {
                            roleName: "医院商管理员",
                            agencyId: info.orgInfo.agencyId,
                            hospitalId: info.orgInfo.id,
                        };
                        break;
                    case "CENTER":
                        roleInfo = {
                            roleName: "科室商管理员",
                            agencyId: info.orgInfo.agencyId,
                            hospitalId: info.orgInfo.hospitalId,
                            centerId: info.orgInfo.id,
                        };
                        break;
                }
                roleInfo.roleType = data.roleType;
                roleInfo.accessPermission = permissionInfo.permissions;
                roleInfo.isDelete = false;
                roleInfo.isPreset = true;
                // console.log(roleInfo);
                roleInfo = await roleService.create(roleInfo);

                data.roleID = roleInfo.id;
                info.adminInfo = await userService.addOrganizationAdmin(data);
                let adminID = info.adminInfo.id;
                info.orgInfo = await orgDao.update({ id: data.orgID }, { adminID: adminID });
            } else {
                throw new Error("添加组织失败");
            }

            return info;
        }
    },

    findOne: async function (query) {
        "use strict";
        // query['isDelete'] = query['isDelete'] || false;
        return orgDao.findOne(query)
    },

    findOneWithAdmin: async function (query) {
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        let data = {};
        data.orgInfo = await orgDao.findOne(query);
        if (!!data.orgInfo) {
            data.adminInfo = await userService.findOne({ id: data.orgInfo.adminID });
        } else {
            throw new Error(CONST.ORG_NOT_EXIST);
        }
        return data;
    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        "use strict";
        return orgDao.count(query)
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
        return orgDao.findByQuery(query, paginates, orderby)
    },

    find: async function (query) {
        'use strict';
        return orgDao.find(query);
    },

    del: async function (query) {
        'use strict';
        let updateData = { isDelete: true };
        return orgDao.update(query, updateData);
    },
    delDecide: async function (data, sess) {
        'use strict';

        let orgs = data.data.toString();


        data.data = JSON.parse(orgs);

        let result = {
            res: 'SUCCESS',
            data: {}
        };
        let delIDtype = '';
        let delNametype = '';
        let roleIDtype = '';
        let delQuery = {};
        let chilQuery = {};
        // console.log(sess)

        switch (data.delType) {
            case 'AGENCY':
                delIDtype = 'agencyId';
                delNametype = 'agencyName';
                break;
            case 'HOSPITAL':
                delIDtype = 'hospitalId';
                delNametype = 'hospitalName';
                break;
            case 'CENTER':
                delIDtype = 'centerId';
                delNametype = 'centerName';
                break;
        }
        switch (sess.user.roleType) {
            // switch (data.roleType) {
            case 'AGENCY':
                roleIDtype = 'agencyId';
                break;
            case 'HOSPITAL':
                roleIDtype = 'hospitalId';
                break;
            case 'CENTER':
                roleIDtype = 'centerId';
                break;
        }
        // delQuery[delIDtype] = data.data;
        delQuery.id = data.data;
        delQuery.roleType = data.delType;
        //非超管加上所属Id
        if (sess.user.roleType !== 'SUADMIN') {
            // if (data.roleType !== 'ADMIN') {
            delQuery[roleIDtype] = sess.user.orgId;
            // delQuery[roleIDtype] = data.agencyId;
        }
        delQuery['isDelete'] = delQuery['isDelete'] || false;
        // console.error('---------------')
        // console.log(delQuery)

        let delData = await orgDao.find(delQuery);
        // console.log(delData)


        if (delData.length !== 0) {

            chilQuery[delIDtype] = data.data;
            chilQuery['isDelete'] = false;
            let chilData = await orgDao.find(chilQuery);

            if (chilData.length === 0) {
                let updateData = { isDelete: true };
                let userQuery = {};

                // console.log(userQuery);


                let userData = await userDao.update({ orgID: data.data }, updateData)

                let orgData = await orgDao.update(delQuery, updateData);


                let succResult = {};
                succResult.userData = userData;
                succResult.orgData = orgData;
                result.res = 'SUCCESS';
                result.data = succResult;
                return result;
            } else {
                let errSult = {
                    errData: []
                };
                let errData = [];
                console.error('---------------')
                // console.log(chilData)

                // _.map(chilData, (v) => {
                //     errData.push(v[delNametype])
                // })
                console.log(delNametype)
                _.forEach(chilData, (v) => {
                    console.log(v[delNametype])
                    errData.push(v[delNametype]);
                })
                console.log(errData)


                errSult.errData = errData;
                errSult.mess = CONST.NOT_EMPTY;
                console.log(errSult)
                result.res = 'FAIL';
                result.data = errSult;
                console.log(result)

                return result;

            }
        } else {
            throw Error(CONST.ORG_NOT_EXIST);
        }





    },

    switchEnableStatus: async function (id, roleType, data) {

        let query = { id: id };
        let query2 = {};
        let orgInfo = await this.findOne(query);
        let fatherIDs = [];

        if (roleType === "ADMIN" || roleType === "SUADMIN" || (orgInfo.roleType && (data.agencyId && data.agencyId === orgInfo.agencyId) || (data.hospitalId && data.hospitalId === orgInfo.hospitalId))) {
            switch (orgInfo.roleType) {

                case 'AGENCY':
                    query2.or = [{ agencyId: id }, { id: id }];
                    break;
                case 'HOSPITAL':
                    query2.or = [{ agencyId: orgInfo.agencyId, hospitalId: id }, { id: id }];
                    fatherIDs.push(orgInfo.agencyId);
                    break;
                case 'CENTER':
                    query2.or = [{ agencyId: orgInfo.agencyId, hospitalId: orgInfo.hospitalId, centerId: id }, { id: id }];
                    fatherIDs.push(orgInfo.agencyId);
                    fatherIDs.push(orgInfo.hospitalId);
                    break;
            }
            if (data.isEnable) {
                let fatherInfo = await this.find(fatherIDs);
                _.forEach(fatherInfo, function (v) {
                    if (v.hasOwnProperty('isEnable') && !v.isEnable) {
                        throw new Error(CONST.FATHER_DISABLE);
                    }
                })
            }
            return this.updateOrg(query2, { isEnable: data.isEnable });
        } else {
            throw new Error(CONST.PARAM_ERR)
        }
    }



};