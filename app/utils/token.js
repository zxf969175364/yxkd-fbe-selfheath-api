/**
 * Created by zjp on 16/9/20.
 */
'use strict';
import jwt from 'jwt-simple';
import redis from './redis';

const secret = 'hms';
const issString = 'hms';


export  default  {

    /**
     * 根据用户名、密码、有效时间生成 token，并保存到 redis 中，TTL 为一天。
     * @param data
     * @returns {*}
     */
    getToken: async function (data) {

        // var payload = {                          //refer: https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32
        //     "iss": "hms",
        //     "exp": 1441594722,                   //expired time
        //     "aud": "www.example.com",
        //     "sub": "jrocket@example.com",
        //     "nbf"：1449878                        //not before
        // };

        let tokenObj = {};
        let payload = {};
        payload.iss = issString;
        tokenObj.expire = _.moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
        payload.exp = tokenObj.expire.valueOf();
        payload = _.assign(payload, data);
        let token = jwt.encode(payload, secret).toString();
        let result = await redis.set(token, tokenObj.expire);      //redis 中用 token 作为 key 保存，value 可以是任意值。
        if (result != "OK"){                //检查 redis 执行结果
            return false;
        }
        tokenObj.token = token;
        return tokenObj;
    },

    /**
     * token 验证，如果 token 错误或者 token 超时则返回 false，否则返回 token 信息
     * @param token
     * @returns {*}
     */
    tokenAuthenticate: async function (token) {
        let value = await redis.get(token);     //检查 redis 中是否有记录，否则返回错误
        if (!value){
            return false;
        }
        let profile = {};
        try {
            profile = await jwt.decode(token, secret);      //反解 token
        } catch (err) {
            console.log(err.message);
            return false;
        }
        if (Date.now() > profile.exp) {           //检查 token 是否过期，否则返回错误。
            return false;
        }
        if (profile.iss != issString){            //检查 token 中 iss 是否匹配，token 中没有 aud， 不做检查。
            return false;
        }
        return profile;
    },

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
    }
};
