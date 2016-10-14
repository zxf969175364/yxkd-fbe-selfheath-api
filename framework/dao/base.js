/**
 * Created by G on 2016/6/15 0015.
 */

export default class {

    constructor(tableName) {
        this.init(tableName)
    }
    init(tableName) {
        this.tableName = tableName;
        this.model = D.model(tableName)
    }


    async find(query){
        'use strict';
        return this.model.find(query).toPromise();

    }

    /**
     * 新增
     * @param data 要创建的数据
     */
    async create(data) {
        'use strict';
        return this.model.create(data).toPromise();
    }

    /**
     * 根据条件查询
     * @param query         条件
     * @param paginates     分页
     * @param sort          排序
     */
    async findByQuery(query,paginates,sort){
        'use strict';
        return this.model.find(query).paginate(paginates).sort(sort).toPromise();

    }
    /**
     * 统计数量
     * @param query
     */
    async count(query){
        'use strict';
        return this.model.count(query).toPromise();
    }
    /**
     * 查询单条数据
     * @param query
     */
    async findOne(query){
        'use strict';
        return this.model.findOne(query).toPromise();
    }
    /**
     * 删除数据，真实从数据库中删除数据
     * @param query
     */
    async destroy(query){
        "use strict";
        return this.model.destroy(query).toPromise()
    }

  /**
   * 删除数据,假删除
   * @param query
   * @param data
   */
  async remove(query){
    return this.model.update(query,{isDelete:true}).toPromise()
  }

    /**
     * 更新数据
     * @param query 查询条件
     * @param data 更新的数据
     */
    async update(query, data){
        "use strict";
        return this.model.update(query,data).toPromise()
    }

    async __before(){}

    async __after(){}

    async invoke(action,...args){
        await this.__before();
        if (!this.res.headersSent) await this[action](...args);
        if (!this.res.headersSent) await this.__after()
    }
}