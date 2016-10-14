export default (root, app, core)=> {
    'use strict'

    return {
        //所有涉及到路径的问题放这里
        path: {
            controller: app + '/controller',
            config: app + '/config',
            model: app + '/model',
            view: app + '/view',
            service: app + '/service',
            dao: app + '/dao',
            tmp: app + '/runtime',
            permission: app + '/controller/permission',    //权限管理
            public:app + '/public',
            root: root,
            app: app,
            core: core
        },
        rest: ['api'],//restful api 的定位 避免传统接口冲突
        web: {
            module: 'home',//默认模块
            controller: 'index',//默认控制层
            action: 'index'//默认执行函数
        },
        cdn: '/static',
        cookie: {
            secret: '1234567890~!@',
            version: '0.01',//控制cookie 版本
        },
        socket: false
    }
}
