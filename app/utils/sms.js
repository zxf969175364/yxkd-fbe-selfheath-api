/**
 * Created by zj on 16/8/10.
 */

"use strict";
import https from 'https'
import querystring from 'querystring'

export default{
    /**
     * 发送短信方法
     * @param {String} strphone  //多个电话，用“,”隔开
     * @param {String} strmsg  //信息内容
     * @returns {Promise}
     */
    sendSMS:(phone,msg) => {

        // if (G.env.NODE_ENV !== "production"){
        if (0){
            console.log('-----');
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve("发送短信成功");

                }, 100)
          })
        }else {
            return new Promise(function (resolve,reject){
                let apiKey="b5246efd6545b1c02f4567e3334cc40c"
                let postData = {
                    "username":"yxkd"
                    ,"password":"zyt20130705"
                    ,"apikey":apiKey
                    ,"mobile":phone
                    ,"content":msg
                    ,"encode":1
                }
                let path = '/api/send/index.php'
                let content = querystring.stringify(postData)
                let options = {
                    host:'m.5c.com.cn',
                    path:path,
                    method:'POST',
                    headers:{
                        'Content-Type' : 'application/x-www-form-urlencoded',
                        'Content-Length' :content.length
                    }
                }
                let req = https.request(options,function(res){
                    res.setEncoding('utf8')
                    let resMsg= ''
                    res.on('data', function (chunk) {
                        console.log(chunk)
                        resMsg += chunk
                    })
                    res.on('end',function(){
                        console.log(resMsg)
                        if(resMsg.indexOf('success')>-1)
                        {
                            console.log("=============== 发送信息成功 ===============")
                            resolve(resMsg)
                        } else
                        {
                            console.log("=============== 发送信息失败 ===============")
                            reject(new Error(resMsg))
                        }
                    })
                });
                req.write(content)
                req.end()
            });
        }
    }
}