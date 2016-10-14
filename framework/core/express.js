/**
 * Created by zj on 16/5/17.
 */


import express from 'express'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import compression from 'compression'
import swig from 'swig'
import fs from 'fs'
import session from 'express-session'
import multipart from 'connect-multiparty'
import redis from 'redis';
// import {session as RedisStore}  from 'connect-redis'
// var RedisStore = require('connect-redis')(session);
import connectRedis from 'connect-redis'
var RedisStore = connectRedis(session);

//初始化 redis
global.R = {};
R.client = redis.createClient(G.redis.port, G.redis.ip, G.redis.option);

R.client.on('error', function (err) {
    T.log(__filename, 'Error:' + err);
});

R.client.on('connect', function() {
    T.log(__filename, 'Redis 连接成功');
});


export default () => {
    //express 初始化
    var app = express();
    // 压缩请求资源
    app.use(compression({ level: 9 }));
    // 直接解析 G.cdn 文件夹下的静态资源
    if (G.cdn.indexOf('http') === -1) app.use(G.cdn, express.static(G.path.root + '/app/static', { maxAge: 86400000 }));
    //定义模板 开发环境不缓存模板,模板根路径定位到 view 目录
    G.path.view = (!G.debug) && G.path.view.replace('/view', '/build/view') || G.path.view;
    swig.setDefaults({ cache: false, autoescape: false, loader: swig.loaders.fs(G.path.view) });
    swig.setDefaultTZOffset(8);
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', G.path.view + '/');
    app.set('view cache', false);
    //favicon使用方式
    if (fs.existsSync(G.path.root + '/favicon.ico')) app.use(favicon(G.path.root + '/favicon.ico'));
    //app.use(display());//display 封装
    if (G.debug) app.use(logger('dev'));//开发环境性进行debug
    app.use(bodyParser.json({ limit: "1mb" }));//接受json 传输格式 restful 必备
    app.use(bodyParser.urlencoded({ limit: "1mb", extended: false }));//传统url 传输方式
    app.use(cookieParser(G.cookie.secret));//cookie 使用注册
    app.use(session({
        store: new RedisStore({ client: R.client }),
        secret: 'iceice', // 建议使用 128 个字符的随机字符串
        cookie: { maxAge: 3600 * 1000, httpOnly: true },
        resave: true,
        rolling: true,
        saveUninitialized: true
    }));

    // app.use(upload);

    app.use(multipart({
        uploadDir: G.path.tmp
    }));

    //x-powered-by 操作
    //app.set('x-powered-by', 'xxx')
    app.disable('x-powered-by');

    //设置跨域访问
    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Origin", req.header("Origin"));
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Content-Type,X-Requested-With,Pragma,Cache-Control,If-Modified-Since");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", 'Express 4.x');
        res.header("Content-Type", "application/json;charset=utf-8");
        if (req.method == "OPTIONS") res.sendStatus(200);
        else next();
    });


    // 总路由
    require(G.path.core + '/core/route').default(app);
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // no stacktraces leaked to user
    app.use((err, req, res, next) => {
        var err_msg = {
            res: 'FAIL',
            error: {
                code: err.status || 500,
                message: err.message
            }
        };
        res.status(err.status || 500);
        T.debug(__filename, err);

        res.json(err_msg);
        /*if(req.is('html')){
         req.display('/common/error',err_msg)
         }else{
         res.json(err_msg)
         }*/
    });

    // 启动服务器
    /*var server = app.listen(G.port,()=>{
     console.log('ENode server listening on port ' + server.address().port);
     });*/

    return app

}
