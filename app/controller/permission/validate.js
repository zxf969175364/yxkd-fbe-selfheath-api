/**
 * Created by hgs on 16/7/26.
 *
 */
// import roleService from '../../service/hms/auth/role'

//权限验证
export default class {
    constructor(...args) {
        this.init(...args);
    }
    init(req, res, next) {
        this.req = req
        this.res = res
        this.next = next
        this.rq = req.rq
        // this.startTime = Date.now()
    }


    async validate() {
        // console.log(this.req.session)
        console.error(this.req.rq)
        let visit = {
            module: this.req.rq.module,
            controller: this.req.rq.controller,
            action: [this.req.rq.action]
        }
        // visit = this.req.rq;   //用户访问权限

        // console.log(visit)
        let result = {};

        //放行权限
        let privilege = [{
            module: 'hms',
            controller: 'auth_check',
            action: ['post']
        }, {
                module: 'hms',
                controller: 'customer_auth_check',
                action: ['post']

            }, {
                module: 'hms',
                controller: 'captcha',
                action: ['get']
            }, {
                module: 'hms',
                controller: 'log_out',
                action: ['post']
            }, {
                module: 'hms',
                controller: 'find_password',
                action: ['post']
            }
        ];
        if (_.find(privilege, visit) || visit.module === 'AssessApi') {
            result.code = '200';
        } else {
            // delete visit.module;  
            // console.log(this.req.session)
            let permissions = this.req.session.permissions
            if (!this.req.session.isLogin) {     //判断用户是否登录
                result.code = "401";
                result.message = "用户未登录";
            } else {  //用户已登录
                result.code = '200'

                // if (_.find(permissions, visit)) { //controller  action 通过 
                //     result.code = '200';
                // if (this.req.rq.id) {
                //     result.code = '200';
                // } else {
                //     let roleType = this.req.session.user.roleTye;
                //     switch (roleType) {
                //         case 'AGENCY':
                //             this.req.query.agencyId === this.req.session.user.orgId ? result.code = '200' : result.code = '403';
                //             break;
                //         case 'HOSPITAL':
                //             this.req.query.hospitalId === this.req.session.user.orgId ? result.code = '200' : result.code = '403';
                //             break;
                //         case 'CENTER':
                //             this.req.query.centerId === this.req.session.user.orgId ? result.code = '200' : result.code = '403';
                //             break;
                //         case 'CUSTOMER':
                //             this.req.query.id === this.req.session.user.uId ? result.code = '200' : result.code = '403';
                //             break;
                //     }
                // }

                // } else if (_.find(permissions, 'all')) {   //超管放行
                //     return result.code = "200";
                // } else {    //controller  action 未通过通过

                //     switch (visit.action) {
                //         case "get":
                //             result.code = "403.2";
                //             result.message = "没有访问权限";
                //             break;
                //         case "post":
                //             result.code = "403.3.0";
                //             result.message = "没有写入权限";
                //             break;
                //         case "put":
                //             result.code = "403.3.1";
                //             result.message = "没有更新权限";
                //             break;
                //         case "delete":
                //             result.code = "403.3.2";
                //             result.message = "没有删除执行权限";
                //             break;
                //         default:
                //             result.code = "403";
                //             result.message = "权限不足";
                //             break;
                //     }
                // }


            }

        }



        return result;
        // if (_.find(privilege, visit)) {
        //     result.code = '200';
        // } else {
        //     // delete visit.module;  
        //     let permissions = this.req.session.permissions
        //     if (!permissions) {     //判断用户是否登录
        //         result.code = "401";
        //         result.message = "用户未登录";
        //     } else if (_.find(permissions, 'ALL') || _.find(permissions, visit)) {
        //         result.code = '200';
        //     } else if (_.find(permissions, visit.controller)) {
        //         switch (visit.action) {
        //             case "get":
        //                 result.code = "403.2";
        //                 result.message = "没有访问权限";
        //                 break;
        //             case "post":
        //                 result.code = "403.3.0";
        //                 result.message = "没有写入权限";
        //                 break;
        //             case "put":
        //                 result.code = "403.3.1";
        //                 result.message = "没有更新权限";
        //                 break;
        //             case "delete":
        //                 result.code = "401";
        //                 result.message = "没有删除执行权限";
        //                 break;
        //             default:
        //                 result.code = "403";
        //                 result.message = "权限不足";
        //                 break;
        //         }
        //     } else {
        //         result.code = "403";
        //         result.message = "权限不足";

        //     }

        // }



        // return result;




    }

};



