/**
 * Created by zj on 16/5/24.
 */

module.exports = (function(){
    "use strict"
    let env = G.env.NODE_ENV

    const specific = {
        //所有个性化设置
        development: {
            app: {
                port: 5000,
                name: "hms - Dev",
                keys: [ "hms-Dev-hurr-durr" ]
            },
            /**
             * 配置数据库方法
             */
            db:{
                connections: {
                    'hms': {
                        adapter: 'mongo',
                        host: '182.254.240.238',
                        port: 27017,
                        user: 'hms',
                        password: 'hmstest121',
                        database: 'hms'
                    }
                }
            },
            redis : {
                "ip": "139.196.204.50",
                "port": 6379,
                "option": {
                    "connect_timeout": 5000,
                    "auth_pass": "ecarlife121"
                },
            }
        },
        test: {
            app: {
                port: 5000,
                name: "test - test",
                keys: [ "super-secret-hurr-durr" ]
            },
            //waterline,sails-mongo配置
            db:{
                connections: {
                    'hms': {
                        adapter: 'mongo',
                        host: '139.196.198.242',
                        port: 27017,
                        user: 'hms',
                        password: 'hmstest121',
                        database: 'hms'
                    }
                }
            },
            redis : {
                "ip": "182.254.240.238",
                "port": 6379,
                "option": {
                    "connect_timeout": 5000,
                    "auth_pass": "ecarlife121"
                },
            }
        },
        production:{
            app: {
                port: 5000,
                name: "production - production",
                keys: [ "super-secret-hurr-durr" ]
            },
            //waterline,sails-mongo配置
            db:{
                connections: {
                    'hms': {
                        adapter: 'mongo',
                        host: '139.196.198.242',
                        port: 27017,
                        user: 'hms',
                        password: 'hmstest121',
                        database: 'hms'
                    }
                }
            },
            redis : {
                "ip": "182.254.240.238",
                "port": 6379,
                "option": {
                    "connect_timeout": 5000,
                    "auth_pass": "ecarlife121"
                },
            }
        },
    }
    return specific[env]
})()