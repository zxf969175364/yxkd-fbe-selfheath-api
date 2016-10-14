/**
 * Created by zjp on 16/10/9.
 */

export default {

    /**
     * 获取指定 key 的记录，如果有则返回value，如果没有对应的记录则返回 null。
     * @param key
     * @returns {Promise}
     */
    get: (key) => {
        return new Promise(function (resolve, reject) {
            R.client.get(key, function (err, replay) {
                if (err) {
                    reject(err);
                }else {
                    resolve(replay);

                }
            })
        })
    },

    /**
     * 向 redis 中添加记录， 如果添加成功则返回"OK"， 否则返回错误信息。
     * @param k key
     * @param v value
     * @param expire    TTL
     * @returns {Promise}
     */
    set: (k, v, expire) => {
        let ttl = 24 * 60 * 60 || expire;   //设置ttl，默认时长一天
        return new Promise(function (resolve, reject) {
            R.client.set(k, v, function (err, replay) {
                if (err){
                    reject(err);
                }else {
                    R.client.expire(k, ttl);       //设置ttl
                    resolve(replay);
                }
            })
        })
    },


    /**
     * 删除指定 key 的记录，返回删除数量
     * @param key
     * @returns {Promise}
     */
    del: (key)=>{
        return new Promise(function (resolve, reject) {
            R.client.del(key, function (err, replay) {
                if (err){
                    reject(err);
                }else{
                    resolve(replay);
                }
                
            })
        })
    }

};