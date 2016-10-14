/**
 * Created by zj on 16/5/19.
 */

import fs from '../utils/fs'
import token from '../utils/token'

export default (app)=> {
    //restful 方法
    var Func = async (req, res, next)=> {
        req.rq = {}
        req.rq.module = req.params.module || G.web.module
        req.rq.controller = req.params.controller || G.web.controller
        req.rq.action = req.params.action || G.web.action
        var id = req.params.id
        if (!req.params.action && !(req.url === '/')) {
            switch (req.method) {
                case 'GET':
                    req.rq.action = 'get';
                    break;
                case 'POST':
                    req.rq.action = 'post';
                    break;
                case 'PUT':
                    req.rq.action = 'put';
                    break;
                case 'DELETE':
                    req.rq.action = 'delete';
                    break;
            }
        }

        let result = await token.tokenAuthenticate(req, res, next);
        if (!result){
            return;
        }

        //权限过滤   Created by hgs on 16/7/27.
        //-----------------------
        // console.log(req.rq)
        var permiss_file_path = G.path.permission + '/validate';
        var perCheck = await fs.exists(permiss_file_path + '.js');
        if (perCheck) {
            try {
                let perValid = require(permiss_file_path).default;
                perValid = new perValid(req, res, next);
                let result = await perValid.validate();
                // console.log(result)
                if (result.code !== '200') {
                    var err_msg = {
                        res: 'FAIL',
                        error: result
                    }
                    // console.log(err_msg)
                    res.json(err_msg)
                }
                // else {
                //     // var err_msg = {
                //     //     res: 'FAIL',
                //     //     error: result
                //     // }
                //     // console.log(err_msg)
                //     // res.json(err_msg)
                // }

            } catch (e) {
                console.log(e)
                next(e)

            }

        } else {
            next('找不到相应资源')
        }

        // console.log(req)
        //-----------------------
        //权限过滤
        var rest_name = (req.rest_name) ? '/' + req.rest_name : ''
        var load_file_path = G.path.controller + rest_name + '/' + req.rq.module + '/' + req.rq.controller
        var check = await fs.exists(load_file_path + '.js')
        if (check) {
            try {
                let cls = require(load_file_path).default
                cls = new cls(req, res, next)
                //await cls[req.rq.action]()
                console.log(req.rq.action)
                await cls.invoke(req.rq.action)

            } catch (e) {
                next(e)
            }

        } else {
            next('找不到相应资源')
        }
    }

    var restFunc = (name)=> {
        return (req, res, next)=> {
            req.rest_name = name
            return Func(req, res, next)
        }
    }

    app.get('/', Func)
    //rest
    _.forEach(G.rest, (v, k)=> {
        app.get('/' + v + '/:module/:controller', restFunc(v))
        app.get('/' + v + '/:module/:controller/:id', restFunc(v))
        app.post('/' + v + '/:module/:controller', restFunc(v))
        app.put('/' + v + '/:module/:controller/:id', restFunc(v))
        app.delete('/' + v + '/:module/:controller/:id', restFunc(v))
        app.put('/' + v + '/:module/:controller', restFunc(v))
        app.delete('/' + v + '/:module/:controller', restFunc(v))
    })

    //custom
    app.get('/:module/:controller/:action', Func)
    app.get('/:module/:controller/:action/:id', Func)
    app.post('/:module/:controller/:action', Func)
    app.post('/:module/:controller/:action/:id', Func)
}