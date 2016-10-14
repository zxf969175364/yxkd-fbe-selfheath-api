/**
 * Created by zj on 16/6/3.
 */

//使用framework中base创建model对象，base中已经包含基本操作方法，可以直接使用。
//如不满足需求请自行重写或添加方法。

export default {


    /**
     * 封装dao层部分操作后示例，兼容旧代码，只有dao层发生变化，其他不变。
     * 可以直接调用base中的方法，如果不满足需求则自己重写或添加方法。
     * 自己添加方法需要return Promise对象
     * @param query
     */

    find : async function(query){
        'use strict';
        return D.model('user').find(query);
    },


    /**
     * 添加用户
     * @param user
     */



    create : async function(user){
        "use strict";
        return D.model('user').create(user).toPromise()
    },

    /**
     * 删除用户
     * @param query
     */
    remove : async function(query){
        "use strict";
        return D.model('user').update(query,{isDelete: true}).toPromise()
    },

    /**
     * 修改用户信息
     * @param query
     * @param data
     */
    update: async function(query, data){
        'use strict';
      return D.model('user').update(query,data).toPromise();
    },

    /**
     * 根据用户名查询用户
     * @param userName
     * @returns {*}
     */
    findByName : async function(userName){
        "use strict";
        return D.model('user').findOne({ userName : userName, isDelete : false }).toPromise()
    },

    /**
     * 根据条件查询用户
     * @param query
     * @param paginates
     * @param orderby
     * @returns {*}
     */
    findByQuery : async function(query,paginates,orderby){
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return D.model('user').find(query).paginate(paginates).sort(orderby).toPromise()
    },
    /**
     * 根据条件查询单个
     * @param query
     */
    findOne : async function(query){
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return D.model('user').findOne(query).toPromise()
    },
  /**
   * 计算数量
   * @param query
   */
  count : async function(query){
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return D.model('user').count(query).toPromise()
    }
    
    
}