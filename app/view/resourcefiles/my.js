var app=angular.module('myApp',['ui.router','ui.bootstrap','ngAlertify']);
//app.constant('apiUrl','http://139.196.204.50:5000/api/hms/');
app.constant('apiUrl','http://192.168.1.26:5000/api/hms/');
//app.constant('apiUrl','http://192.168.1.31:5000/api/hms/');
app.run(["alertify", "ipCookie", "$rootScope", "$state", function(alertify,ipCookie,$rootScope,$state){
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        if(toState.name=='login'||toState.name=='Forget'||toState.name=='sight')return;// 如果是进入登录界面则允许
        // 如果用户不存在
        if(!ipCookie('user')){
            event.preventDefault();// 取消默认跳转行为
            $state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
            alertify.alert("请先登录");
        }
    });
}])
app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider,$urlRouterProvider,$httpProvider){
    $httpProvider.defaults.withCredentials = true;
    $urlRouterProvider.when('','/login');
    $urlRouterProvider.when('/','/index');
    $urlRouterProvider.otherwise('/','/login');
    $stateProvider     //也可以自己写路由块
        .state('index',{
            url:'/index',
             templateUrl:'./module/index/index.html',
             controller:'indexController'
        })
        .state('newIndex',{
            url:'/newIndex',
            templateUrl:'./module/index/newIndex.html',
            controller:'newIndexController'
        })
        .state('newIndex.manage',{
            url:'/Progress',
            templateUrl:'./module/index/manage.html',
        })
        .state('newIndex.idcard',{
            url:'/idcard',
            templateUrl:'./module/index/idcard.html',
            controller:'idcardController'

        })
        .state('newIndex.Information',{
            url:'/Information',
            templateUrl:'./module/index/Information.html',
        })
        .state('newIndex.Answer',{
            url:'/Answer/:id',
            templateUrl:'./module/index/Answer.html',
            controller: 'AnswerController'
        })
        .state('newIndex.refer',{
            url:'/refer',
            templateUrl:'./module/index/refer.html',
            controller: 'referController'
        })
        .state('newIndex.accomplish',{
            url:'/accomplish/:id',
            templateUrl:'./module/index/accomplish.html',
            controller: 'accomplishController'
    })
        .state('user',{
            url:'/user',
            templateUrl:'./module/user/user.html'
        })
        .state('login',{
            url:'/login',
            templateUrl:'./module/login/login.html',
            controller:'loginController'
        })
        .state('personalData', {
            url: '/personalData',
            templateUrl: './module/index/personalData.html',
            controller: 'personalDataController'
        })
        .state('personalData.compile', {
            url: '/compile',
            templateUrl: './module/index/compile.html',
            controller: 'compileController'
        })
        .state('personalData.Save', {
            url: '/Save',
            templateUrl: './module/index/Save.html',
            controller: 'SaveController'
        })
        .state('personalData.disease', {
            url: '/disease',
            templateUrl: './module/index/disease.html',
        })
        .state('personalData.present', {
            url: '/present/:id',
            templateUrl: './module/index/present.html',
            controller: 'presentController'
        })
        .state('personalData.sheets', {
            url: '/sheets',
            templateUrl: './module/index/sheets.html',
            controller: 'sheetsController'
        })
        .state('personalData.medical',{
            url:'/medical',
            templateUrl:'./module/index/medical.html',
        })
        .state('personalData.Scantron',{
            url:'/Scantron',
            templateUrl:'./module/index/Scantron.html',
            controller: 'ScantronController'
        })
        .state('loginPage',{
            url:'/loginPage',
            templateUrl:'./module/login/loginPage.html',
            controller:'loginPageController'
        })
        .state('history',{
            url:'/history',
            templateUrl:'./module/login/history.html',
            controller:'historyController'
        })
        .state('Evaluation',{
            url:'/Evaluation',
            templateUrl:'./module/index/Evaluation.html',
            controller:'EvaluationController'
        })
        .state('main',{
            url:'/main',
            templateUrl:'./module/index/main.html'
        })
        .state('Physical',{
            url:'/Physical',
            templateUrl:'./module/login/Physical.html',
            controller:'PhysicalController'
        })
        .state('Report',{
            url:'/Report',
            templateUrl:'./module/login/Report.html',
            controller:'ReportController'
        })
        .state('combo',{
            url:'/combo',
            templateUrl:'./module/login/combo.html',
            controller:'comboController'
        })
        .state('Forget',{
            url:'/Forget',
            templateUrl:'./module/login/Forget.html',
            controller:'forgetController'
        })
        .state('sight',{
            url:'/sight',
            templateUrl:'./module/login/sight.html',
        })
}]);
/**
 * Created by C_yx on 2016/6/12.
 */
app.directive('dom',function(){
    return{
        restrict:'A',
        scope:{
            max:"=",
            val:"=",
            section:"=",
            plan:"=",
            length:"="
        },
        link:function(vm,element,attrs){
            vm.$watch("val", function(newValue, oldValue) {
                if(vm.section!=5){
                    vm.t=(vm.val/vm.max)*(100/vm.length)+(100/vm.length)*vm.section+'%';
                    element.css('width',vm.t);
                    console.log(vm.t)
                }
            });
        }
    }
});
app.directive('width',function(){
    return{
        restrict:'A',
        scope:{
            length:"="
        },
        link:function(vm,element,attrs){
            vm.t=100/vm.length+'%';
            element.css('width',vm.t);
        }
    }
});
app.directive('topMenu',["ipCookie", "$state", function(ipCookie,$state){
    return {
        restrict:'E',
        replace:true,
        scope:{},
        templateUrl:'./module/user/menu.html',
        link:function(scope){
            scope.data=ipCookie('user')
            scope.logout=function(){
                ipCookie('user','')
                ipCookie('card','')
                $state.go('login')
            }
        }
    }
}])
//app.directive('Proress',function(){
//    return {
//        restrict:'E',//显示方式
//        replace:true,
//        scope:{},//作用域
//        templateUrl:'./module/user/menu.html',//模板地址
//    }
//})
/**
 * Created by C_yx on 2016/6/23.
 */
"use strict";
app.filter("TAB",function(){
    return function(str){
         var a=str.split(".");
        return a[0]
    }
})
      .filter("NAME",function(){
        return function(str){
            var a=str.split(".");
            return a[1]
        }
    });
/**
 * Created by Administrator on 2016/6/23.
 */
app.factory('ipCookie', ['$document',
    function ($document) {
        'use strict';
         function tryDecodeURIComponent(value) {
            try {
                return decodeURIComponent(value);
            } catch(e) {
                // Ignore any invalid uri component
            }
        }

        return (function () {
            function cookieFun(key, value, options) {
                var cookies,
                    list,
                    i,
                    cookie,
                    pos,
                    name,
                    hasCookies,
                    all,
                    expiresFor;

                options = options || {};
                var dec = options.decode || tryDecodeURIComponent;
                var enc = options.encode || encodeURIComponent;

                if (value !== undefined) {
                    // we are setting value
                    value = typeof value === 'object' ? JSON.stringify(value) : String(value);

                    if (typeof options.expires === 'number') {
                        expiresFor = options.expires;
                        options.expires = new Date();
                        // Trying to delete a cookie; set a date far in the past
                        if (expiresFor === -1) {
                            options.expires = new Date('Thu, 01 Jan 1970 00:00:00 GMT');
                            // A new
                        } else if (options.expirationUnit !== undefined) {
                            if (options.expirationUnit === 'hours') {
                                options.expires.setHours(options.expires.getHours() + expiresFor);
                            } else if (options.expirationUnit === 'minutes') {
                                options.expires.setMinutes(options.expires.getMinutes() + expiresFor);
                            } else if (options.expirationUnit === 'seconds') {
                                options.expires.setSeconds(options.expires.getSeconds() + expiresFor);
                            } else if (options.expirationUnit === 'milliseconds') {
                                options.expires.setMilliseconds(options.expires.getMilliseconds() + expiresFor);
                            } else {
                                options.expires.setDate(options.expires.getDate() + expiresFor);
                            }
                        } else {
                            options.expires.setDate(options.expires.getDate() + expiresFor);
                        }
                    }
                    return ($document[0].cookie = [
                        enc(key),
                        '=',
                        enc(value),
                        options.expires ? '; expires=' + options.expires.toUTCString() : '',
                        options.path ? '; path=' + options.path : '',
                        options.domain ? '; domain=' + options.domain : '',
                        options.secure ? '; secure' : ''
                    ].join(''));
                }

                list = [];
                all = $document[0].cookie;
                if (all) {
                    list = all.split('; ');
                }

                cookies = {};
                hasCookies = false;

                for (i = 0; i < list.length; ++i) {
                    if (list[i]) {
                        cookie = list[i];
                        pos = cookie.indexOf('=');
                        name = cookie.substring(0, pos);
                        value = dec(cookie.substring(pos + 1));
                        if(angular.isUndefined(value))
                            continue;

                        if (key === undefined || key === name) {
                            try {
                                cookies[name] = JSON.parse(value);
                            } catch (e) {
                                cookies[name] = value;
                            }
                            if (key === name) {
                                return cookies[name];
                            }
                            hasCookies = true;
                        }
                    }
                }
                if (hasCookies && key === undefined) {
                    return cookies;
                }
            }
            cookieFun.remove = function (key, options) {
                var hasCookie = cookieFun(key) !== undefined;
                if (hasCookie) {
                    if (!options) {
                        options = {};
                    }
                    options.expires = -1;
                    cookieFun(key, '', options);
                }
                return hasCookie;
            };
            return cookieFun;
        }());
    }
]);
/**
 * Created by C_yx on 2016/6/6.
 */
"use strict";
//代理商列表
app.controller('newIndexController', ["$scope", "$http", "apiUrl", "NATION", "PROVINCE", "CITY", "CULTURE", "MARRIAGE", "OCCUPATION", "HEALTH", "VISIT", "SEX", "ipCookie", function ($scope, $http, apiUrl, NATION, PROVINCE, CITY, CULTURE, MARRIAGE, OCCUPATION, HEALTH, VISIT, SEX, ipCookie) {
    var vm = $scope.vm = {};
    vm.nation = NATION;
    vm.province = PROVINCE;
    vm.city = CITY;
    vm.sex = SEX;
    vm.culture = CULTURE;
    vm.marriage = MARRIAGE;
    vm.occupation = OCCUPATION;
    vm.health = HEALTH;
    vm.visit = VISIT;
    vm.plan = 0;
    vm.section = 0;
    vm.toIndex = '0-1';
    vm.gender = 'MALE';
    vm.card = ipCookie('card');
    //console.log(vm.card);
    vm.isAgree = function () {
        /*//vm.toIndex = '0-2';
         /!*vm.agree={确定协议接口
         "cardNumber":vm.card.cardNumber,
         /!*"questionnaireId":vm.obj.id,*!/
         "isAgree":true
         };
         //确定协议
         $http.post(apiUrl+'result',vm.agree);*!/
         //请求个人资料*/
        $http.get(apiUrl + 'card/' + vm.card.id).then(function (res) {
            vm.customerInfo = res.data.data;
        })
    };
}]);
app.controller('idcardController', ["$http", "apiUrl", "process", "$scope", "method", "ipCookie", "NATION", "PROVINCE", "CITY", "CULTURE", "MARRIAGE", "OCCUPATION", "HEALTH", "VISIT", "SEX", "alertify", "$state", "share", function ($http, apiUrl, process, $scope, method, ipCookie, NATION, PROVINCE, CITY, CULTURE, MARRIAGE, OCCUPATION, HEALTH, VISIT, SEX, alertify, $state, share) {
    var vm = $scope.vm = {};
    vm.card = ipCookie('card');
    vm.nation = NATION;
    vm.province = PROVINCE;
    vm.city = CITY;
    vm.sex = SEX;
    vm.culture = CULTURE;
    vm.marriage = MARRIAGE;
    vm.occupation = OCCUPATION;
    vm.health = HEALTH;
    vm.visit = VISIT;
    if (vm.card.customerId) {
        $http.get(apiUrl + 'customers/' + vm.card.customerId).then(function (res) {
            console.log(res);
            vm.customerInfo = res.data.data;
            vm.customerInfo = ipCookie('card');
            ipCookie('card',vm.cardInfo);
            console.log(ipCookie('card'));
        })
    }
    vm.datum = function (boole) {
        vm.customerInfo.cardId = ipCookie("card").id;
        if (boole) {
            vm.a = 2;
            vm.customerInfo.province = process.city(vm.province, vm.customerInfo.provinceId, 'province');
            vm.customerInfo.city = process.city(vm.city, vm.customerInfo.cityId, 'city');
            var updateUrl = apiUrl + 'customers/';
            if (ipCookie("card").customerId != undefined) {
                updateUrl += ipCookie("card").customerId;
            }
            vm.customerInfo.cardId = ipCookie("card").id;
            //console.log(ipCookie('card'));
            $http.post(apiUrl +  'get_fit_questionnaire', vm.customerInfo).then(function (res) {
                vm.data = res.data.data;
                sessionStorage.obj = JSON.stringify(vm.data);
                ipCookie('parameter', vm.customerInfo);
                if(res.data.res === "SUCCESS"){
                    $http.put(updateUrl, vm.customerInfo).then(function (res) {
                        vm.states = res.data.res;
                        //console.log(ipCookie("card"));
                        //$state.go("personalData.compile");
                        if(res.data.res === "SUCCESS"){
                            $state.go('newIndex.Answer', {id: 0});
                        }else{
                            alertify.alert(res.data.error.message);
                            vm.name="hh"                        }
                    })
                }else{
                    alertify.alert("身份证号有误！")
                    vm.name="hh"
                }
            })
        }
        else {
            alertify.alert("信息有误")
        }
    }
    /*vm.next=function(boole,$scope){
        if(!boole){
            alertify.alert('身份证号有误！')
        }

    }*/
}]);
app.controller('SaveController', ["$http", "apiUrl", "process", "$scope", "method", "ipCookie", "NATION", "PROVINCE", "CITY", "CULTURE", "MARRIAGE", "OCCUPATION", "HEALTH", "VISIT", "SEX", "alertify", "$state", function ($http, apiUrl, process, $scope, method, ipCookie, NATION, PROVINCE, CITY, CULTURE, MARRIAGE, OCCUPATION, HEALTH, VISIT, SEX, alertify, $state) {
    var vm = $scope.vm = {};
    vm.nation = NATION;
    vm.province = PROVINCE;
    vm.city = CITY;
    vm.sex = SEX;
    vm.b=function(sId) {
        if (sId.length == 18) {
            vm.data.gender = sId.substr(16, 1) % 2 ? "男" : "女"
        } else if (sId.length == 15) {
            vm.data.gender = sId.substr(14, 1) % 2 ? "男" : "女"
        }
    }
    vm.culture = CULTURE;
    vm.marriage = MARRIAGE;
    vm.occupation = OCCUPATION;
    vm.health = HEALTH;
    vm.visit = VISIT;
    //vm.data=ipCookie('card');
    if (ipCookie('card').customerId) {
        $http.get(apiUrl + 'customers/' + ipCookie("card").customerId).then(function (res) {
            vm.data = res.data.data;
            console.log(vm.data);
        })
    }
    vm.ngclick = function (boole) {
        if (boole) {
            vm.a = 2;
            vm.data.province = process.city(vm.province, vm.data.provinceId, 'province');
            vm.data.city = process.city(vm.city, vm.data.cityId, 'city');
            var updateUrl = apiUrl + 'customers/';
            if (ipCookie("card").customerId != undefined) {
                updateUrl += ipCookie("card").customerId;
            }
            console.log(ipCookie("card"));
            vm.data.cardId = ipCookie("card").id;
            //ipCookie('card',vm.data);
            //console.log(ipCookie("card"));
            //$state.go("personalData.compile");
            $http.put(updateUrl, vm.data).then(function (res) {
                console.log(res);
                if(res.data.res === "SUCCESS"){
                    ipCookie('card', res.data.data[0]);
                    $state.go("personalData.compile");
                    if(vm.ipCookie('card').customerId){
                        $http.get(apiUrl + 'customers/'+ vm.ipCookie('card').customerId).then(function (res) {
                            vm.data = res.data.data;
                        })
                    }
                }
            })
        }
        else {
            alertify.alert("信息有误")
        }
    };
}])
app.controller('compileController', ["$http", "apiUrl", "process", "$scope", "method", "ipCookie", "NATION", "PROVINCE", "CITY", "CULTURE", "MARRIAGE", "OCCUPATION", "HEALTH", "VISIT", "SEX", function ($http, apiUrl, process, $scope, method, ipCookie, NATION, PROVINCE, CITY, CULTURE, MARRIAGE, OCCUPATION, HEALTH, VISIT, SEX) {
    $scope.parsent = 'one';
    var vm = $scope.vm = {};
    vm.nation = NATION;
    vm.province = PROVINCE;
    vm.city = CITY;
    vm.sex = SEX;
    vm.culture = CULTURE;
    vm.marriage = MARRIAGE;
    vm.occupation = OCCUPATION;
    vm.health = HEALTH;
    vm.visit = VISIT;
    vm.cardInfo = ipCookie('card');
    console.log(vm.cardInfo);
    if(vm.cardInfo.customerId){
        $http.get(apiUrl + 'customers/'+ vm.cardInfo.customerId).then(function (res) {
            vm.data = res.data.data;
            console.log(res);
            //console.log(ipCookie("card"));
        })
    }
}])
app.controller('AnswerController', ["$scope", "$interval", "$uibModal", "alertify", "$http", "apiUrl", "ipCookie", "process", "method", "$state", "share", function ($scope, $interval, $uibModal, alertify, $http, apiUrl, ipCookie, process, method, $state, share) {
    //改的
    var vm = $scope.vm = {};
    var i;
    vm.section = $state.params.id;
    vm.newData = [];
    vm.hear = [];
    vm.gender = ipCookie('parameter').gender;
    vm.card = ipCookie('card');
    //console.log(vm.card);
    function Request() {
        vm.obj = JSON.parse(sessionStorage.obj).questionnaire;
        //if (localStorage.section) {
        // vm.section = localStorage.section;
        // }
        vm.datas = vm.obj.section[vm.section];
        vm.data = process.sex(vm.datas.questions, vm.gender);//通过性别筛题，
        //console.log(vm.obj);
        vm.toIndex = vm.data[0].index;
        if (vm.section != 0) {
            vm.toIndex = vm.data[0].index;
        }
        vm.val = process.index(vm.data, vm.toIndex);
        vm.familyHistory = {
            index: 1,
            answer: [],
            title: vm.data[0].questionName
        };
    }

    Request();
    //console.log(vm.card);
    /*switch(vm.card.finishSection){
     case '第一部分题目':
     vm.section=1;
     vm.a=0;
     vm.plan=18;
     break;
     case '第二部分题目':
     vm.section=2;
     vm.a=1;
     vm.plan=18;
     break;
     case '第三部分题目':
     vm.section=3;
     vm.a=2;
     vm.plan=18;
     break;
     case '第四部分题目':
     vm.section=4;
     vm.a=3;
     vm.plan=18;
     break;
     case '第五部分题目':
     vm.section=5;
     vm.a=4;
     vm.plan=18;
     break;
     case '第六部分题目':
     vm.toIndex="a";
     vm.time=5;
     $interval(function(){
     vm.time--;
     if(vm.time==0){
     $state.go("Report")
     }
     },1000);
     break;
     }*/
    //http://192.168.23.88:5000/api/hms/questionnaire/575e5237e11613b40d320f26
    /* $http.get(apiUrl + 'questionnaire/' + vm.id).then(function (res) {
     if (localStorage.section) {
     vm.section = localStorage.section;
     }
     vm.obj = res.data.data;
     vm.datas = vm.obj.section[vm.section].questions;
     vm.data = process.sex(vm.datas, vm.gender);//通过性别筛题，

     vm.data = vm.datas;
     vm.toIndex = vm.data[0].index;
     console.log(vm.datas);
     //console.log(vm.data);
     if (vm.section != 0) {
     vm.toIndex = vm.data[0].index;
     }
     vm.val = process.index(vm.data, vm.toIndex);
     vm.familyHistory = {
     index: 1,
     answer: [],
     title: vm.data[0].questionName
     };
     });*/
    vm.history = function (gender, str) {
        vm.gender = gender;
        vm.toIndex = vm.data[0].options[0].toIndex;
        vm.sire = str;
        vm.val = process.index(vm.data, vm.toIndex);
        process.no(vm.data[1].options);
    };
    vm.CMP = function (obj, index) {
        var model = $uibModal.open({
            templateUrl: './module/index/addInput.html',
            size: 'md',
            backdrop: 'static',
            controller: ["$scope", "$uibModalInstance", "data", function ($scope, $uibModalInstance, data) {
                var vm = $scope.vm = {};
                vm.ble = data;
                if (data) {
                    var sId = data.IDNumber;
                    var birthday = sId.substr(6, 4) + "-" + sId.substr(10, 2) + "-" + Number(sId.substr(12, 2));
                    vm.time = process.age(birthday);
                }
                vm.dismiss = function () {
                    $uibModalInstance.dismiss('这里是点击XX关的')
                };
                vm.add = function () {
                    $uibModalInstance.close(vm.value);
                }
            }],
            resolve: {
                data: obj
            }
        });
        model.result.then(function (res) {
            index.age = res
        });
    };
    vm.way = function (topic, index, $index) {
        if (topic.questionType === "SINGLE_CHOICE") {//判断是不是单选
            method.radio(topic.options, $index);//只能选一个
            var a = process.seek(vm.data, index.toIndex);//判断模块是否结束（有没有下一题）
            if (index.toIndex != "" && index.toIndex != 'THIS_END' && a.length != 0) {
                vm.newData.push(topic);
                vm.toIndex = index.toIndex;
                vm.val = process.index(vm.data, vm.toIndex);
            } else {
                vm.index = true
            }
        }
        if (topic.questionType === "MULTI_CHOICE") {
            if (index.optionType == "下拉" && index.$checkbox) {//下拉时间
                vm.CMP(ipCookie('parameter'), index)
            }
            if (index.optionType == "输入" && index.$checkbox) {//输入
                vm.CMP(false, index)
            }
            //弹窗childPopUp
            if (vm.datas.sectionName == '健康史' && index.$checkbox && index.toIndex == '1-3') {
                var data = process.seek(vm.data, index.toIndex);
                data.chlid = index.optionName;
                data.sire = vm.sire;
                data.gender = vm.gender;
                process.no(vm.data[3].options);
                method.ModalDialog('./module/index/addSelection.html', data)
                    .result.then(function (res) {
                    vm.hear.push(res);
                    console.log(vm.hear)
                })
            }
            //有子题的
            if (index.toIndex != "" && index.toIndex && index.toIndex !== '1-3') {  //childPopUp弹框
                vm.toIndex = index.toIndex;
                vm.val = process.index(vm.data, vm.toIndex);
                vm.option = index.optionTag + '.' + index.optionName;
                if (vm.datas.sectionName == '健康史') {
                    process.no(vm.data[2].options);
                }
            }
        }
    };
    vm.topicDown = function (topic) {
        vm.val = process.index(vm.data, vm.toIndex);
        var required = topic.options.some(function (item) {//判断答案有没有被选中
            return item.$checkbox
        });
        if (required) {
            if (topic.questionType === "SINGLE_CHOICE" && process.checked(topic.options) != undefined) {
                vm.toIndex = process.checked(topic.options);//checked  判断选中的是那道题的下一题是哪道题？
                vm.val = process.index(vm.data, vm.toIndex);
                vm.newData.push(topic);
            }
            if (topic.questionType === "MULTI_CHOICE") {
                if (topic.toIndex == 1) {//判断是不是家族史
                    vm.hear.push(topic);
                    vm.toIndex = topic.toIndex;
                    vm.val = process.index(vm.data, vm.toIndex);
                    vm.newHear = process.family(vm.hear, vm.sire, vm.option);
                    vm.hear = [];
                    vm.familyHistory.answer.push(vm.newHear);
                    console.log(vm.familyHistory)
                } else if (topic.toIndex == 2) {
                    vm.toIndex = topic.toIndex;
                    vm.val = process.index(vm.data, vm.toIndex);
                    var newTopic = angular.copy(topic);
                    vm.hear.push(newTopic);
                    process.no(topic.options);
                }
                else {
                    vm.toIndex = topic.toIndex;
                    vm.val = process.index(vm.data, vm.toIndex);//模块进度--答到哪一题了
                    vm.newData.push(topic);
                }
            }
        } else {
            alertify.alert("请选择答案")
        }
    };
    vm.topicUp = function () {
        i = vm.newData.length - 1;
        if (i <= 0) {
            vm.toIndex = 1
        } else {
            vm.index = false;
            vm.toIndex = vm.newData[i].index;
            vm.val = process.index(vm.data, vm.toIndex);
            vm.newData.splice(i, 1);//回到上一题，清除下一题   就是上一题不能直接跳到下下题
        }
    };
    vm.submit = function (topic) {
        vm.section = parseInt(vm.section);
        //console.log(vm.section);
        //localStorage.section = vm.section + 1;
        vm.dismiss = true;//控制提交之后不能重复提交
        vm.newData.push(topic);
        vm.newObj = angular.copy(vm.obj);
        vm.newObj.section = [];
        vm.newData = process.questions(vm.newData);
        /*if (vm.obj.section[vm.section].sectionName == '健康史') {
         vm.newData.unshift(vm.familyHistory);//vm.familyHistory--第一部分的答案
         }*/
        vm.newObj = {
            "cardNumber": vm.card.cardNumber,
            "questionnaireId": vm.obj.id,
            "questionnaireName": vm.obj.questionnaireName,
            finishSection: vm.obj.section[vm.section].sectionName,
            "nextSection": vm.obj.section[vm.section + 1] ? vm.obj.section[vm.section + 1].sectionName : '没有了',
            "isFinished": vm.section == vm.obj.section.length,
            "agencyId": ipCookie("card").agencyId,
            "hospitalId": ipCookie("card").hospitalId,
            "centerId": ipCookie("card").centerId,
            "cardId": ipCookie("card").id,
            "customerId": ipCookie("card").customerId,
            section: [{
                questions: vm.newData,
                sectionName: vm.obj.section[vm.section].sectionName
            }]
        };
        $http.post(apiUrl + 'result', vm.newObj).then(function (res) {
            //console.log(res);
            vm.section = vm.section + 1;
            if (res.data.data) {
                vm.Objs = res.data.data.section[vm.section - 1].result;
                console.log(vm.Objs);
                //share.set(vm.Objs, 'data');
                //sessionStorage.data = JSON.stringify(vm.Objs);
                //vm.obj=share.get().datas.questionnaire;
                //console.log(vm.Objs);
            }
            vm.dismiss = false;
            if (vm.section <= vm.obj.section.length - 1) {
                $state.go("newIndex.accomplish", {id: vm.section});
                vm.a = vm.section;//vm.a判断圆圈是不是变颜色
                vm.val = vm.data.length;
            } else {
                $state.go("newIndex.refer");
            }
        });

        /*vm.nextModule = function () {
         vm.index = false;
         vm.section += 1;
         //console.log(vm.section);
         if (vm.section < vm.obj.section.length) {
         vm.newData = [];
         vm.datas = vm.obj.section[vm.section].questions;
         vm.data = process.sex(vm.datas, vm.gender);
         vm.toIndex = vm.data[0].index;
         vm.val = process.index(vm.data, vm.toIndex);
         $state.go('newIndex.Answer');
         //console.log(vm.data)
         }
         };*/
    };
    //console.log(res);
}]);
app.controller('accomplishController', ["$scope", "$state", function ($scope, $state) {
    var vm = $scope.vm = {};
    //vm.obj=JSON.parse(sessionStorage.data);
    //console.log(vm.obj);
    vm.next = function () {
        $state.go('newIndex.Answer', {id: $state.params.id})
    }
    //console.log($state.params.id);
    //$state.params.id;   通过id
}])
app.controller("referController", ["$scope", "$interval", "$state", function ($scope, $interval, $state) {
    var vm = $scope.vm = {};
    vm.time = 5;
    $interval(function () {
        vm.time--;
        if (vm.time === 0) {
            $state.go("Evaluation")
        }
    }, 1000)
}]);
app.controller('sheetsController', ["$scope", "$state", "$http", "$interval", "method", "process", "alertify", "ipCookie", "apiUrl", function ($scope, $state, $http, $interval, method, process, alertify, ipCookie, apiUrl) {
    var vm = $scope.vm = {};
    vm.newData = [];
    var i;
    vm.plan = 0;
    vm.section = 0;
    vm.toIndex = 5;
    vm.gender = 'MALE';
    //vm.card=ipCookie('card');
    $scope.card = ipCookie("card");
    $http.get(apiUrl + 'questionnaire/' + $scope.card.questionnaireId).then(function (res) {
        $scope.objs = res.data.data.section[0].questions;
        console.log($scope.objs);
        vm.way = function (topic, index, $index) {
            if (topic.questionType === "SINGLE_CHOICE") {//判断是不是单选
                method.radio(topic.options, $index);//只能选一个
                console.log(topic.options);
                if (index.toIndex != "") {
                    vm.toIndex = index.toIndex;
                    vm.newData.push(topic);
                }
            }
            if (topic.questionType === "MULTI_CHOICE") {
                var data = process.seek($scope.objs, index.toIndex);
                if (index.childPopUp && index.$checkbox) {
                    method.ModalDialog('./module/index/addSelection.html', data)
                        .result.then(function (res) {
                        index.age = res
                    })
                }
                //弹窗childPopUp
                if (index.childPopUp && index.$checkbox && index.toIndex == '1.1.1') {
                    data.chlid = index.optionName;
                    data.sire = vm.sire;
                    data.gender = vm.gender;
                    process.no(vm.data[2].options);
                    method.ModalDialog('./module/index/addSelection.html', data)
                        .result.then(function (res) {
                        vm.hear.push(res);
                        console.log(vm.hear)
                    })
                }
                //有子题的
                if (index.toIndex != "" && index.childPopUp == undefined) {  //childPopUp弹框
                    vm.toIndex = index.toIndex;
                    vm.val = process.index(vm.data, vm.toIndex);
                    vm.option = index.optionTag + '.' + index.optionName;
                }
            }
        };
        vm.topicDown = function (topic) {
            var required = topic.options.some(function (item) {//判断答案有没有被选中
                return item.$checkbox
            });
            if (required) {
                if (topic.questionType === "SINGLE_CHOICE" && process.checked(topic.options) != undefined) {
                    vm.toIndex = process.checked(topic.options);//checked  判断选中的是那道题的下一题是哪道题？
                    vm.val = process.index($scope.objs, vm.toIndex);
                    vm.newData.push(topic);
                }
                if (topic.questionType === "MULTI_CHOICE") {
                    if (topic.toIndex == 1) {//判断是不是家族史
                        vm.hear.push(topic);
                        vm.toIndex = topic.toIndex;
                        vm.val = process.index(vm.data, vm.toIndex);
                        vm.newHear = process.family(vm.hear, vm.sire, vm.option);
                        vm.hear = [];
                        vm.familyHistory.answer.push(vm.newHear);
                        console.log(vm.familyHistory)
                    } else if (topic.toIndex == 2) {
                        vm.toIndex = topic.toIndex;
                        vm.val = process.index(vm.data, vm.toIndex);
                        var newTopic = angular.copy(topic);
                        vm.hear.push(newTopic);
                        process.no(topic.options);
                    }
                    else {
                        vm.toIndex = topic.toIndex;
                        vm.val = process.index(vm.data, vm.toIndex);//模块进度--答到哪一题了
                        vm.newData.push(topic);
                    }
                }
            } else {
                alertify.alert("请选择答案")
            }
        };
        vm.topicUp = function () {
            i = vm.newData.length - 1;
            if (i <= 0) {
                vm.toIndex = 5
            } else {
                vm.index = false;
                vm.toIndex = vm.newData[i].index;
                //vm.val=process.index(vm.data,vm.toIndex);
                vm.newData.splice(i, 1);//回到上一题，清除下一题   就是上一题不能直接跳到下下题
            }
        };
    })
}]);
app.controller('personalDataController', ["$scope", function ($scope) {
    var vm = $scope.vm = {};
    vm.a = 2;
    vm.tab = 'personalData';
}]);
app.controller('ScantronController', ["$scope", "$state", "$http", "$interval", "method", "process", "alertify", "ipCookie", "apiUrl", function ($scope, $state, $http, $interval, method, process, alertify, ipCookie, apiUrl) {
    var vm = $scope.vm = {};
    vm.newData = [];
    var i;
    vm.plan = 0;
    vm.section = 0;
    vm.toIndex = 1;
    vm.gender = 'MALE';
    //vm.card=ipCookie('card');
    $scope.card = ipCookie("card");
    $http.get(apiUrl + 'questionnaire/' + $scope.card.questionnaireId).then(function (res) {
        $scope.item = res.data.data.section[0].questions;
        console.log($scope.item);
        vm.way = function (topic, index, $index) {
            if (topic.questionType === "SINGLE_CHOICE") {//判断是不是单选
                method.radio(topic.options, $index);//只能选一个
                console.log(topic.options);
                if (index.toIndex != "") {
                    vm.toIndex = index.toIndex;
                    vm.newData.push(topic);
                }
            }
            if (topic.questionType === "MULTI_CHOICE") {
                var data = process.seek($scope.item, index.toIndex);
                if (index.childPopUp && index.$checkbox) {
                    method.ModalDialog('./module/index/addSelection.html', data)
                        .result.then(function (res) {
                        index.age = res
                    })
                }
                //弹窗childPopUp
                if (index.childPopUp && index.$checkbox) {
                    data.chlid = index.optionName;
                    data.sire = vm.sire;
                    data.gender = vm.gender;
                    process.no($scope.item[2].options);
                    method.ModalDialog('./module/index/addSelection.html', data)
                        .result.then(function (res) {
                        vm.hear.push(res);
                        console.log(vm.hear)
                    })
                }
                //有子题的
                if (index.toIndex != "" && index.childPopUp == undefined) {  //childPopUp弹框
                    vm.toIndex = index.toIndex;
                    vm.val = process.index($scope.item, vm.toIndex);
                    vm.option = index.optionTag + '.' + index.optionName;
                }
            }
        };
        vm.topicDown = function (topic) {
            var required = topic.options.some(function (item) {//判断答案有没有被选中
                return item.$checkbox
            });
            if (required) {
                if (topic.questionType === "SINGLE_CHOICE" && process.checked(topic.options) != undefined) {
                    vm.toIndex = process.checked(topic.options);//checked  判断选中的是那道题的下一题是哪道题？
                    vm.val = process.index($scope.objs, vm.toIndex);
                    vm.newData.push(topic);
                }
                if (topic.questionType === "MULTI_CHOICE") {
                    vm.hear = [];
                    if (topic.toIndex == 1) {//判断是不是家族史
                        vm.hear.push(topic);
                        vm.toIndex = topic.toIndex;
                        vm.val = process.index(vm.data, vm.toIndex);
                        vm.newHear = process.family(vm.hear, vm.sire, vm.option);
                        vm.familyHistory.answer.push(vm.newHear);
                        console.log(vm.familyHistory)
                    } else if (topic.toIndex == 2) {
                        vm.toIndex = topic.toIndex;
                        vm.val = process.index(vm.data, vm.toIndex);
                        var newTopic = angular.copy(topic);
                        vm.hear.push(newTopic);
                        process.no(topic.options);
                    }
                    else {
                        vm.toIndex = topic.toIndex;
                        vm.val = process.index(vm.data, vm.toIndex);//模块进度--答到哪一题了
                        vm.newData.push(topic);
                    }
                }
            } else {
                alertify.alert("请选择答案")
            }
        };
        vm.history = function (gender, str, num) {
            vm.gender = gender;
            vm.toIndex = num;
            vm.sire = str;
            vm.val = process.index(vm.data, vm.toIndex);
            process.no(vm.data[1].options);
        };
        vm.topicUp = function () {
            i = vm.newData.length - 1;
            if (i <= 0) {
                vm.toIndex = 5
            } else {
                vm.index = false;
                vm.toIndex = vm.newData[i].index;
                vm.newData.splice(i, 1);//回到上一题，清除下一题   就是上一题不能直接跳到下下题
            }
        };
    })
}]);
app.controller('EvaluationController', ["$scope", "$uibModal", "alertify", "$http", "apiUrl", "ipCookie", function ($scope, $uibModal, alertify, $http, apiUrl, ipCookie) {
    var vm = $scope.vm = {};
    $scope.habit = 'illness';
    vm.aaClick = function () {
        var a = $uibModal.open({
            templateUrl: './module/user/yuyue.html',
            controller: ["$scope", "ipCookie", "$uibModalInstance", function ($scope, ipCookie, $uibModalInstance) {
                vm.data = ipCookie('card');
                console.log(ipCookie('card'));
                vm.dismiss = function () {
                    $uibModalInstance.dismiss()
                };
                vm.queding = function () {
                    $uibModalInstance.dismiss();
                    alertify.success('预约成功')
                }
            }]
        })
    }
    vm.hh = ipCookie('card');
    //console.log(vm.hh);
    /*$http.get(apiUrl+'user_order/'+vm.hh.batchId).then(function(res){
     var data=res.data.data.capaData;
     var datas=res.data.data.cardData;
     console.log(res);
     })*/
    vm.cardId = vm.hh.id;
    vm.report = JSON.parse(sessionStorage.obj).questionnaire.questionnaireName;
    $http.post(apiUrl + 'report', {cardId: vm.cardId, questionnaireName: vm.report}).then(function (res) {
        vm.datas = res.data.data;
        //vm.data = res.data.data.sections;
        console.log(res);
    })
}])
app.controller('presentController', ["$state", "$scope", function ($state, $scope) {
    $scope.id = parseInt($state.params.id);
    $scope.hs = function () {
        if ($scope.id == 2) {
            $scope.name = '现病史';
        }
        if ($scope.id == 3) {
            $scope.name = '过敏史';
            $scope.toIndex = 5;
        }
        if ($scope.id == 4) {
            $scope.name = '用药史'
        }
        if ($scope.id == 5) {
            $scope.name = '手术史'
        }
        if ($scope.id == 6) {
            $scope.name = '月经生育史'
        }
    }
    $scope.addNumber = function () {
        if ($scope.id <= 5) {
            $scope.id += 1;
            $scope.hs();
        }
    }
    $scope.prepNumber = function () {
        if ($scope.id >= 3) {
            $scope.id -= 1;
            $scope.hs();
        } else if ($scope.id == 2) {
            $state.go("personalData.medical");
        }
    }
    $scope.hs();
}])


/*
 * Created by C_yx on 2016/6/6.
 */
app.factory('method',["$uibModal", function($uibModal){
    return{
        ModalDialog:function(url,data){
            var  _add=$uibModal.open({
                templateUrl:url,
                 size:'lg',
                backdrop:'static',
                controller:["$scope", "data", "$uibModalInstance", "method", "alertify", "process", function($scope,data,$uibModalInstance,method,alertify,process) {
                    var vm = $scope.vm = {};
                    vm.data=data;
                    vm.way=function(index,$index){
                        method.radio(index,$index);
                    };
                    vm.dismiss = function () {
                        $uibModalInstance.dismiss('这里是点击XX关的')
                    };
                    vm.add = function () {
                        if(vm.data.questionType!=='FILL_IN'){
                            var required=vm.data.options.some(function(item){
                                return item.$checkbox
                            });
                            if (required) {
                                vm.newData=angular.copy(vm.data);
                                $uibModalInstance.close(vm.newData);
                                vm.data.options.$checkbox=false;
                            }else{
                                alertify.alert("请选择答案")
                            }
                        }else{
                            if(vm.value!=''){
                                $uibModalInstance.close(vm.value);
                                console.log(vm.value)
                            }

                        }

                    };
                }],
                resolve:{
                    data:data
                }
            });

           return _add
        },
        radio:function(list,$index){
            angular.forEach(list,function(item){
                item.$checkbox=false
            });
            list[$index].$checkbox=true;
            return list
        }
    }
}])
    .factory('process',["$filter", function($filter){
        return{
            questions:questions,
            checked:checked,
            seek:seek,
            age:age,
            sex:sex,
            family:family,
            no:no,
            index:index,
            city:city,
            CityId:CityId
        };
        function questions(list){
            var result=[];
            list.map(function(item){
                answer(item);
                list={
                    index:item.index,
                    title:item.questionName,
                    answer:item.answer,
                    score:item.score
                };
                result.push(list)
            });
            return result
        }
        function answer(item){
            item.answer=[];
            item.options.map(function(e){
                if(e.$checkbox&&(!e.childPopUp||e.childType=="FILL_IN")){
                    var obj={
                        option:e.optionTag+'.'+ e.optionName,
                        score:e.score,
                        age: e.age
                    };
                    item.answer.push(obj)
                }
            });
            return item
        }
        function checked(item){
            item.map(function(e){
                if(e.$checkbox){
                    item=e.toIndex
                }
            });
            return item
        }
        function seek(list,index){
            var result=[];
            list.map(function(item){
                if(item.index==index){
                    result=item
                }
            });
            return result
        }
        function sex(list,gender){
            var result=[];
            list.map(function(item){
                if(item.constrains[0].value==gender||item.constrains[0].value=='全部'||item.constrains[0].value==null){
                    result.push(item)
                }
            });
            return result
        }
        function age(time){
            var result=[];
            var d=new Date();
            var year=d.getFullYear();
            var t=$filter('date')(time,'yyyy');
            for(year;year>=t;year--){
                result.push(year)
            }
            return result
        }
        function illness(item){
                var obj={};
                item.options.map(function(e){
                    if(e.$checkbox){
                        obj={
                            option:item.chlid,
                            age: e.optionTag+'.'+e.optionName,
                            score: e.score
                        };
                    }
            });
            return obj
        }
        function family(list,sire,option){
            var data,obj,
                result={},
                disease=[];
            list.map(function(item){
                if(item.chlid==undefined&&item.toIndex!=2){
                    data=answer(item);
                    data.answer=data.answer.filter(function(li){
                        return li.option!=option
                    });
                    disease=disease.concat(data.answer)

                }else if(item.toIndex==2){
                    answer(item);
                    obj={
                        option:option,
                        cancer:item.answer
                    };
                    disease.push(obj)
                }
                else{
                    data=illness(item);
                    disease.push(data);
                }
                list={
                    disease:disease,
                    relation:sire
                };
                result=list;
            });
            return result
        }
        function no(list){
            list.map(function(item){
                item.$checkbox=false
            });
            return list
        }
        function index(list,toIndex){
            var value;
            list.forEach(function(item,val){
                if(item.index==toIndex){
                    value=val
                }
            });
            return value
        }
        function city(list,id,type){
            var a;
            list.map(function(item){
                if(type=="city"&&item.CityID==id){
                    a=item.CityName
                }
                if(type=="province"&&item.ProID==id){
                    a=item.ProName
                }
            });
            return a
        }
        function CityId(list,name){
            var a;
            list.map(function(item){
                if(item.CityName==name||item.ProName==name){
                    a=item.CityID||item.ProID
                }
            });
            return a
        }
    }])
    .factory('json',function(){
        return{
            choice:function(list){
                var retule=[];
                angular.forEach(list,function(item){
                    if(item.Options[0].Score==1){
                        retule.push(item)
                    }
                });
                return retule
            },
            multiple:function(list){
                var retule=[];
                angular.forEach(list,function(item){
                    if(item.Options[0].Score==0&&item.Question.Gender==0){
                        retule.push(item)
                    }
                });
                return retule
            }
        }
    })
    //民族
    .constant('NATION', [
          '汉族'
        , '壮族'
        , '满族'
        , '回族'
        , '苗族'
        , '维吾尔族'
        , '土家族'
        , '彝族'
        , '蒙古族'
        , '藏族'
        , '布依族'
        , '侗族'
        , '瑶族'
        , '朝鲜族'
        , '白族'
        , '哈尼族'
        , '哈萨克族'
        , '黎族'
        , '傣族'
        , '畲族'
        , '傈僳族'
        , '仡佬族'
        , '东乡族'
        , '高山族'
        , '拉祜族'
        , '水族'
        , '佤族'
        , '纳西族'
        , '羌族'
        , '土族'
        , '仫佬族'
        , '锡伯族'
        , '柯尔克孜族'
        , '达斡尔族'
        , '景颇族'
        , '毛南族'
        , '撒拉族'
        , '布朗族'
        , '塔吉克族'
        , '阿昌族'
        , '普米族'
        , '鄂温克族'
        , '怒族'
        , '京族'
        , '基诺族'
        , '德昂族'
        , '保安族'
        , '俄罗斯族'
        , '裕固族'
        , '乌孜别克族'
        , '鄂伦春族'
        , '独龙族'
        , '塔塔尔族'
        , '赫哲族'
        , '珞巴族'
    ])
    //省
    .constant('PROVINCE', [
        {"ProID": 1, "ProName": "北京市", "ProSort": 1, "ProRemark": "直辖市"},
        {"ProID": 2, "ProName": "天津市", "ProSort": 2, "ProRemark": "直辖市"},
        {"ProID": 3, "ProName": "河北省", "ProSort": 5, "ProRemark": "省份"}, {
            "ProID": 4,
            "ProName": "山西省",
            "ProSort": 6,
            "ProRemark": "省份"
        }, {"ProID": 5, "ProName": "内蒙古自治区", "ProSort": 32, "ProRemark": "自治区"}, {
            "ProID": 6,
            "ProName": "辽宁省",
            "ProSort": 8,
            "ProRemark": "省份"
        }, {"ProID": 7, "ProName": "吉林省", "ProSort": 9, "ProRemark": "省份"}, {
            "ProID": 8,
            "ProName": "黑龙江省",
            "ProSort": 10,
            "ProRemark": "省份"
        }, {"ProID": 9, "ProName": "上海市", "ProSort": 3, "ProRemark": "直辖市"}, {
            "ProID": 10,
            "ProName": "江苏省",
            "ProSort": 11,
            "ProRemark": "省份"
        }, {"ProID": 11, "ProName": "浙江省", "ProSort": 12, "ProRemark": "省份"}, {
            "ProID": 12,
            "ProName": "安徽省",
            "ProSort": 13,
            "ProRemark": "省份"
        }, {"ProID": 13, "ProName": "福建省", "ProSort": 14, "ProRemark": "省份"}, {
            "ProID": 14,
            "ProName": "江西省",
            "ProSort": 15,
            "ProRemark": "省份"
        }, {"ProID": 15, "ProName": "山东省", "ProSort": 16, "ProRemark": "省份"}, {
            "ProID": 16,
            "ProName": "河南省",
            "ProSort": 17,
            "ProRemark": "省份"
        }, {"ProID": 17, "ProName": "湖北省", "ProSort": 18, "ProRemark": "省份"}, {
            "ProID": 18,
            "ProName": "湖南省",
            "ProSort": 19,
            "ProRemark": "省份"
        }, {"ProID": 19, "ProName": "广东省", "ProSort": 20, "ProRemark": "省份"}, {
            "ProID": 20,
            "ProName": "海南省",
            "ProSort": 24,
            "ProRemark": "省份"
        }, {"ProID": 21, "ProName": "广西壮族自治区", "ProSort": 28, "ProRemark": "自治区"}, {
            "ProID": 22,
            "ProName": "甘肃省",
            "ProSort": 21,
            "ProRemark": "省份"
        }, {"ProID": 23, "ProName": "陕西省", "ProSort": 27, "ProRemark": "省份"}, {
            "ProID": 24,
            "ProName": "新疆维吾尔自治区",
            "ProSort": 31,
            "ProRemark": "自治区"
        }, {"ProID": 25, "ProName": "青海省", "ProSort": 26, "ProRemark": "省份"}, {
            "ProID": 26,
            "ProName": "宁夏回族自治区",
            "ProSort": 30,
            "ProRemark": "自治区"
        }, {"ProID": 27, "ProName": "重庆市", "ProSort": 4, "ProRemark": "直辖市"}, {
            "ProID": 28,
            "ProName": "四川省",
            "ProSort": 22,
            "ProRemark": "省份"
        }, {"ProID": 29, "ProName": "贵州省", "ProSort": 23, "ProRemark": "省份"}, {
            "ProID": 30,
            "ProName": "云南省",
            "ProSort": 25,
            "ProRemark": "省份"
        }, {"ProID": 31, "ProName": "西藏自治区", "ProSort": 29, "ProRemark": "自治区"}, {
            "ProID": 32,
            "ProName": "台湾省",
            "ProSort": 7,
            "ProRemark": "省份"
        }, {"ProID": 33, "ProName": "澳门特别行政区", "ProSort": 33, "ProRemark": "特别行政区"}, {
            "ProID": 34,
            "ProName": "香港特别行政区",
            "ProSort": 34,
            "ProRemark": "特别行政区"
        }])
    // 市
    .constant('CITY', [
        {"CityID": 1, "CityName": "北京市", "ProID": 1, "CitySort": 1},
        {
            "CityID": 2,
            "CityName": "天津市",
            "ProID": 2,
            "CitySort": 2
        }, {"CityID": 3, "CityName": "上海市", "ProID": 9, "CitySort": 3}, {
            "CityID": 4,
            "CityName": "重庆市",
            "ProID": 27,
            "CitySort": 4
        }, {"CityID": 5, "CityName": "邯郸市", "ProID": 3, "CitySort": 5}, {
            "CityID": 6,
            "CityName": "石家庄市",
            "ProID": 3,
            "CitySort": 6
        }, {"CityID": 7, "CityName": "保定市", "ProID": 3, "CitySort": 7}, {
            "CityID": 8,
            "CityName": "张家口市",
            "ProID": 3,
            "CitySort": 8
        }, {"CityID": 9, "CityName": "承德市", "ProID": 3, "CitySort": 9}, {
            "CityID": 10,
            "CityName": "唐山市",
            "ProID": 3,
            "CitySort": 10
        }, {"CityID": 11, "CityName": "廊坊市", "ProID": 3, "CitySort": 11}, {
            "CityID": 12,
            "CityName": "沧州市",
            "ProID": 3,
            "CitySort": 12
        }, {"CityID": 13, "CityName": "衡水市", "ProID": 3, "CitySort": 13}, {
            "CityID": 14,
            "CityName": "邢台市",
            "ProID": 3,
            "CitySort": 14
        }, {"CityID": 16, "CityName": "朔州市", "ProID": 4, "CitySort": 16}, {
            "CityID": 17,
            "CityName": "忻州市",
            "ProID": 4,
            "CitySort": 17
        }, {"CityID": 18, "CityName": "太原市", "ProID": 4, "CitySort": 18}, {
            "CityID": 19,
            "CityName": "大同市",
            "ProID": 4,
            "CitySort": 19
        }, {"CityID": 20, "CityName": "阳泉市", "ProID": 4, "CitySort": 20}, {
            "CityID": 21,
            "CityName": "晋中市",
            "ProID": 4,
            "CitySort": 21
        }, {"CityID": 22, "CityName": "长治市", "ProID": 4, "CitySort": 22}, {
            "CityID": 23,
            "CityName": "晋城市",
            "ProID": 4,
            "CitySort": 23
        }, {"CityID": 24, "CityName": "临汾市", "ProID": 4, "CitySort": 24}, {
            "CityID": 25,
            "CityName": "吕梁市",
            "ProID": 4,
            "CitySort": 25
        }, {"CityID": 26, "CityName": "运城市", "ProID": 4, "CitySort": 26}, {
            "CityID": 27,
            "CityName": "沈阳市",
            "ProID": 6,
            "CitySort": 27
        }, {"CityID": 28, "CityName": "铁岭市", "ProID": 6, "CitySort": 28}, {
            "CityID": 29,
            "CityName": "大连市",
            "ProID": 6,
            "CitySort": 29
        }, {"CityID": 30, "CityName": "鞍山市", "ProID": 6, "CitySort": 30}, {
            "CityID": 31,
            "CityName": "抚顺市",
            "ProID": 6,
            "CitySort": 31
        }, {"CityID": 32, "CityName": "本溪市", "ProID": 6, "CitySort": 32}, {
            "CityID": 33,
            "CityName": "丹东市",
            "ProID": 6,
            "CitySort": 33
        }, {"CityID": 34, "CityName": "锦州市", "ProID": 6, "CitySort": 34}, {
            "CityID": 35,
            "CityName": "营口市",
            "ProID": 6,
            "CitySort": 35
        }, {"CityID": 36, "CityName": "阜新市", "ProID": 6, "CitySort": 36}, {
            "CityID": 37,
            "CityName": "辽阳市",
            "ProID": 6,
            "CitySort": 37
        }, {"CityID": 38, "CityName": "朝阳市", "ProID": 6, "CitySort": 38}, {
            "CityID": 39,
            "CityName": "盘锦市",
            "ProID": 6,
            "CitySort": 39
        }, {"CityID": 40, "CityName": "葫芦岛市", "ProID": 6, "CitySort": 40}, {
            "CityID": 41,
            "CityName": "长春市",
            "ProID": 7,
            "CitySort": 41
        }, {"CityID": 42, "CityName": "吉林市", "ProID": 7, "CitySort": 42}, {
            "CityID": 43,
            "CityName": "延边朝鲜族自治州",
            "ProID": 7,
            "CitySort": 43
        }, {"CityID": 44, "CityName": "四平市", "ProID": 7, "CitySort": 44}, {
            "CityID": 45,
            "CityName": "通化市",
            "ProID": 7,
            "CitySort": 45
        }, {"CityID": 46, "CityName": "白城市", "ProID": 7, "CitySort": 46}, {
            "CityID": 47,
            "CityName": "辽源市",
            "ProID": 7,
            "CitySort": 47
        }, {"CityID": 48, "CityName": "松原市", "ProID": 7, "CitySort": 48}, {
            "CityID": 49,
            "CityName": "白山市",
            "ProID": 7,
            "CitySort": 49
        }, {"CityID": 50, "CityName": "哈尔滨市", "ProID": 8, "CitySort": 50}, {
            "CityID": 51,
            "CityName": "齐齐哈尔市",
            "ProID": 8,
            "CitySort": 51
        }, {"CityID": 52, "CityName": "鸡西市", "ProID": 8, "CitySort": 52}, {
            "CityID": 53,
            "CityName": "牡丹江市",
            "ProID": 8,
            "CitySort": 53
        }, {"CityID": 54, "CityName": "七台河市", "ProID": 8, "CitySort": 54}, {
            "CityID": 55,
            "CityName": "佳木斯市",
            "ProID": 8,
            "CitySort": 55
        }, {"CityID": 56, "CityName": "鹤岗市", "ProID": 8, "CitySort": 56}, {
            "CityID": 57,
            "CityName": "双鸭山市",
            "ProID": 8,
            "CitySort": 57
        }, {"CityID": 58, "CityName": "绥化市", "ProID": 8, "CitySort": 58}, {
            "CityID": 59,
            "CityName": "黑河市",
            "ProID": 8,
            "CitySort": 59
        }, {"CityID": 60, "CityName": "大兴安岭地区", "ProID": 8, "CitySort": 60}, {
            "CityID": 61,
            "CityName": "伊春市",
            "ProID": 8,
            "CitySort": 61
        }, {"CityID": 62, "CityName": "大庆市", "ProID": 8, "CitySort": 62}, {
            "CityID": 63,
            "CityName": "南京市",
            "ProID": 10,
            "CitySort": 63
        }, {"CityID": 64, "CityName": "无锡市", "ProID": 10, "CitySort": 64}, {
            "CityID": 65,
            "CityName": "镇江市",
            "ProID": 10,
            "CitySort": 65
        }, {"CityID": 66, "CityName": "苏州市", "ProID": 10, "CitySort": 66}, {
            "CityID": 67,
            "CityName": "南通市",
            "ProID": 10,
            "CitySort": 67
        }, {"CityID": 68, "CityName": "扬州市", "ProID": 10, "CitySort": 68}, {
            "CityID": 69,
            "CityName": "盐城市",
            "ProID": 10,
            "CitySort": 69
        }, {"CityID": 70, "CityName": "徐州市", "ProID": 10, "CitySort": 70}, {
            "CityID": 71,
            "CityName": "淮安市",
            "ProID": 10,
            "CitySort": 71
        }, {"CityID": 72, "CityName": "连云港市", "ProID": 10, "CitySort": 72}, {
            "CityID": 73,
            "CityName": "常州市",
            "ProID": 10,
            "CitySort": 73
        }, {"CityID": 74, "CityName": "泰州市", "ProID": 10, "CitySort": 74}, {
            "CityID": 75,
            "CityName": "宿迁市",
            "ProID": 10,
            "CitySort": 75
        }, {"CityID": 76, "CityName": "舟山市", "ProID": 11, "CitySort": 76}, {
            "CityID": 77,
            "CityName": "衢州市",
            "ProID": 11,
            "CitySort": 77
        }, {"CityID": 78, "CityName": "杭州市", "ProID": 11, "CitySort": 78}, {
            "CityID": 79,
            "CityName": "湖州市",
            "ProID": 11,
            "CitySort": 79
        }, {"CityID": 80, "CityName": "嘉兴市", "ProID": 11, "CitySort": 80}, {
            "CityID": 81,
            "CityName": "宁波市",
            "ProID": 11,
            "CitySort": 81
        }, {"CityID": 82, "CityName": "绍兴市", "ProID": 11, "CitySort": 82}, {
            "CityID": 83,
            "CityName": "温州市",
            "ProID": 11,
            "CitySort": 83
        }, {"CityID": 84, "CityName": "丽水市", "ProID": 11, "CitySort": 84}, {
            "CityID": 85,
            "CityName": "金华市",
            "ProID": 11,
            "CitySort": 85
        }, {"CityID": 86, "CityName": "台州市", "ProID": 11, "CitySort": 86}, {
            "CityID": 87,
            "CityName": "合肥市",
            "ProID": 12,
            "CitySort": 87
        }, {"CityID": 88, "CityName": "芜湖市", "ProID": 12, "CitySort": 88}, {
            "CityID": 89,
            "CityName": "蚌埠市",
            "ProID": 12,
            "CitySort": 89
        }, {"CityID": 90, "CityName": "淮南市", "ProID": 12, "CitySort": 90}, {
            "CityID": 91,
            "CityName": "马鞍山市",
            "ProID": 12,
            "CitySort": 91
        }, {"CityID": 92, "CityName": "淮北市", "ProID": 12, "CitySort": 92}, {
            "CityID": 93,
            "CityName": "铜陵市",
            "ProID": 12,
            "CitySort": 93
        }, {"CityID": 94, "CityName": "安庆市", "ProID": 12, "CitySort": 94}, {
            "CityID": 95,
            "CityName": "黄山市",
            "ProID": 12,
            "CitySort": 95
        }, {"CityID": 96, "CityName": "滁州市", "ProID": 12, "CitySort": 96}, {
            "CityID": 97,
            "CityName": "阜阳市",
            "ProID": 12,
            "CitySort": 97
        }, {"CityID": 98, "CityName": "宿州市", "ProID": 12, "CitySort": 98}, {
            "CityID": 99,
            "CityName": "巢湖市",
            "ProID": 12,
            "CitySort": 99
        }, {"CityID": 100, "CityName": "六安市", "ProID": 12, "CitySort": 100}, {
            "CityID": 101,
            "CityName": "亳州市",
            "ProID": 12,
            "CitySort": 101
        }, {"CityID": 102, "CityName": "池州市", "ProID": 12, "CitySort": 102}, {
            "CityID": 103,
            "CityName": "宣城市",
            "ProID": 12,
            "CitySort": 103
        }, {"CityID": 104, "CityName": "福州市", "ProID": 13, "CitySort": 104}, {
            "CityID": 105,
            "CityName": "厦门市",
            "ProID": 13,
            "CitySort": 105
        }, {"CityID": 106, "CityName": "宁德市", "ProID": 13, "CitySort": 106}, {
            "CityID": 107,
            "CityName": "莆田市",
            "ProID": 13,
            "CitySort": 107
        }, {"CityID": 108, "CityName": "泉州市", "ProID": 13, "CitySort": 108}, {
            "CityID": 109,
            "CityName": "漳州市",
            "ProID": 13,
            "CitySort": 109
        }, {"CityID": 110, "CityName": "龙岩市", "ProID": 13, "CitySort": 110}, {
            "CityID": 111,
            "CityName": "三明市",
            "ProID": 13,
            "CitySort": 111
        }, {"CityID": 112, "CityName": "南平市", "ProID": 13, "CitySort": 112}, {
            "CityID": 113,
            "CityName": "鹰潭市",
            "ProID": 14,
            "CitySort": 113
        }, {"CityID": 114, "CityName": "新余市", "ProID": 14, "CitySort": 114}, {
            "CityID": 115,
            "CityName": "南昌市",
            "ProID": 14,
            "CitySort": 115
        }, {"CityID": 116, "CityName": "九江市", "ProID": 14, "CitySort": 116}, {
            "CityID": 117,
            "CityName": "上饶市",
            "ProID": 14,
            "CitySort": 117
        }, {"CityID": 118, "CityName": "抚州市", "ProID": 14, "CitySort": 118}, {
            "CityID": 119,
            "CityName": "宜春市",
            "ProID": 14,
            "CitySort": 119
        }, {"CityID": 120, "CityName": "吉安市", "ProID": 14, "CitySort": 120}, {
            "CityID": 121,
            "CityName": "赣州市",
            "ProID": 14,
            "CitySort": 121
        }, {"CityID": 122, "CityName": "景德镇市", "ProID": 14, "CitySort": 122}, {
            "CityID": 123,
            "CityName": "萍乡市",
            "ProID": 14,
            "CitySort": 123
        }, {"CityID": 124, "CityName": "菏泽市", "ProID": 15, "CitySort": 124}, {
            "CityID": 125,
            "CityName": "济南市",
            "ProID": 15,
            "CitySort": 125
        }, {"CityID": 126, "CityName": "青岛市", "ProID": 15, "CitySort": 126}, {
            "CityID": 127,
            "CityName": "淄博市",
            "ProID": 15,
            "CitySort": 127
        }, {"CityID": 128, "CityName": "德州市", "ProID": 15, "CitySort": 128}, {
            "CityID": 129,
            "CityName": "烟台市",
            "ProID": 15,
            "CitySort": 129
        }, {"CityID": 130, "CityName": "潍坊市", "ProID": 15, "CitySort": 130}, {
            "CityID": 131,
            "CityName": "济宁市",
            "ProID": 15,
            "CitySort": 131
        }, {"CityID": 132, "CityName": "泰安市", "ProID": 15, "CitySort": 132}, {
            "CityID": 133,
            "CityName": "临沂市",
            "ProID": 15,
            "CitySort": 133
        }, {"CityID": 134, "CityName": "滨州市", "ProID": 15, "CitySort": 134}, {
            "CityID": 135,
            "CityName": "东营市",
            "ProID": 15,
            "CitySort": 135
        }, {"CityID": 136, "CityName": "威海市", "ProID": 15, "CitySort": 136}, {
            "CityID": 137,
            "CityName": "枣庄市",
            "ProID": 15,
            "CitySort": 137
        }, {"CityID": 138, "CityName": "日照市", "ProID": 15, "CitySort": 138}, {
            "CityID": 139,
            "CityName": "莱芜市",
            "ProID": 15,
            "CitySort": 139
        }, {"CityID": 140, "CityName": "聊城市", "ProID": 15, "CitySort": 140}, {
            "CityID": 141,
            "CityName": "商丘市",
            "ProID": 16,
            "CitySort": 141
        }, {"CityID": 142, "CityName": "郑州市", "ProID": 16, "CitySort": 142}, {
            "CityID": 143,
            "CityName": "安阳市",
            "ProID": 16,
            "CitySort": 143
        }, {"CityID": 144, "CityName": "新乡市", "ProID": 16, "CitySort": 144}, {
            "CityID": 145,
            "CityName": "许昌市",
            "ProID": 16,
            "CitySort": 145
        }, {"CityID": 146, "CityName": "平顶山市", "ProID": 16, "CitySort": 146}, {
            "CityID": 147,
            "CityName": "信阳市",
            "ProID": 16,
            "CitySort": 147
        }, {"CityID": 148, "CityName": "南阳市", "ProID": 16, "CitySort": 148}, {
            "CityID": 149,
            "CityName": "开封市",
            "ProID": 16,
            "CitySort": 149
        }, {"CityID": 150, "CityName": "洛阳市", "ProID": 16, "CitySort": 150}, {
            "CityID": 151,
            "CityName": "济源市",
            "ProID": 16,
            "CitySort": 151
        }, {"CityID": 152, "CityName": "焦作市", "ProID": 16, "CitySort": 152}, {
            "CityID": 153,
            "CityName": "鹤壁市",
            "ProID": 16,
            "CitySort": 153
        }, {"CityID": 154, "CityName": "濮阳市", "ProID": 16, "CitySort": 154}, {
            "CityID": 155,
            "CityName": "周口市",
            "ProID": 16,
            "CitySort": 155
        }, {"CityID": 156, "CityName": "漯河市", "ProID": 16, "CitySort": 156}, {
            "CityID": 157,
            "CityName": "驻马店市",
            "ProID": 16,
            "CitySort": 157
        }, {"CityID": 158, "CityName": "三门峡市", "ProID": 16, "CitySort": 158}, {
            "CityID": 159,
            "CityName": "武汉市",
            "ProID": 17,
            "CitySort": 159
        }, {"CityID": 160, "CityName": "襄樊市", "ProID": 17, "CitySort": 160}, {
            "CityID": 161,
            "CityName": "鄂州市",
            "ProID": 17,
            "CitySort": 161
        }, {"CityID": 162, "CityName": "孝感市", "ProID": 17, "CitySort": 162}, {
            "CityID": 163,
            "CityName": "黄冈市",
            "ProID": 17,
            "CitySort": 163
        }, {"CityID": 164, "CityName": "黄石市", "ProID": 17, "CitySort": 164}, {
            "CityID": 165,
            "CityName": "咸宁市",
            "ProID": 17,
            "CitySort": 165
        }, {"CityID": 166, "CityName": "荆州市", "ProID": 17, "CitySort": 166}, {
            "CityID": 167,
            "CityName": "宜昌市",
            "ProID": 17,
            "CitySort": 167
        }, {"CityID": 168, "CityName": "恩施土家族苗族自治州", "ProID": 17, "CitySort": 168}, {
            "CityID": 169,
            "CityName": "神农架林区",
            "ProID": 17,
            "CitySort": 169
        }, {"CityID": 170, "CityName": "十堰市", "ProID": 17, "CitySort": 170}, {
            "CityID": 171,
            "CityName": "随州市",
            "ProID": 17,
            "CitySort": 171
        }, {"CityID": 172, "CityName": "荆门市", "ProID": 17, "CitySort": 172}, {
            "CityID": 173,
            "CityName": "仙桃市",
            "ProID": 17,
            "CitySort": 173
        }, {"CityID": 174, "CityName": "天门市", "ProID": 17, "CitySort": 174}, {
            "CityID": 175,
            "CityName": "潜江市",
            "ProID": 17,
            "CitySort": 175
        }, {"CityID": 176, "CityName": "岳阳市", "ProID": 18, "CitySort": 176}, {
            "CityID": 177,
            "CityName": "长沙市",
            "ProID": 18,
            "CitySort": 177
        }, {"CityID": 178, "CityName": "湘潭市", "ProID": 18, "CitySort": 178}, {
            "CityID": 179,
            "CityName": "株洲市",
            "ProID": 18,
            "CitySort": 179
        }, {"CityID": 180, "CityName": "衡阳市", "ProID": 18, "CitySort": 180}, {
            "CityID": 181,
            "CityName": "郴州市",
            "ProID": 18,
            "CitySort": 181
        }, {"CityID": 182, "CityName": "常德市", "ProID": 18, "CitySort": 182}, {
            "CityID": 183,
            "CityName": "益阳市",
            "ProID": 18,
            "CitySort": 183
        }, {"CityID": 184, "CityName": "娄底市", "ProID": 18, "CitySort": 184}, {
            "CityID": 185,
            "CityName": "邵阳市",
            "ProID": 18,
            "CitySort": 185
        }, {"CityID": 186, "CityName": "湘西土家族苗族自治州", "ProID": 18, "CitySort": 186}, {
            "CityID": 187,
            "CityName": "张家界市",
            "ProID": 18,
            "CitySort": 187
        }, {"CityID": 188, "CityName": "怀化市", "ProID": 18, "CitySort": 188}, {
            "CityID": 189,
            "CityName": "永州市",
            "ProID": 18,
            "CitySort": 189
        }, {"CityID": 190, "CityName": "广州市", "ProID": 19, "CitySort": 190}, {
            "CityID": 191,
            "CityName": "汕尾市",
            "ProID": 19,
            "CitySort": 191
        }, {"CityID": 192, "CityName": "阳江市", "ProID": 19, "CitySort": 192}, {
            "CityID": 193,
            "CityName": "揭阳市",
            "ProID": 19,
            "CitySort": 193
        }, {"CityID": 194, "CityName": "茂名市", "ProID": 19, "CitySort": 194}, {
            "CityID": 195,
            "CityName": "惠州市",
            "ProID": 19,
            "CitySort": 195
        }, {"CityID": 196, "CityName": "江门市", "ProID": 19, "CitySort": 196}, {
            "CityID": 197,
            "CityName": "韶关市",
            "ProID": 19,
            "CitySort": 197
        }, {"CityID": 198, "CityName": "梅州市", "ProID": 19, "CitySort": 198}, {
            "CityID": 199,
            "CityName": "汕头市",
            "ProID": 19,
            "CitySort": 199
        }, {"CityID": 200, "CityName": "深圳市", "ProID": 19, "CitySort": 200}, {
            "CityID": 201,
            "CityName": "珠海市",
            "ProID": 19,
            "CitySort": 201
        }, {"CityID": 202, "CityName": "佛山市", "ProID": 19, "CitySort": 202}, {
            "CityID": 203,
            "CityName": "肇庆市",
            "ProID": 19,
            "CitySort": 203
        }, {"CityID": 204, "CityName": "湛江市", "ProID": 19, "CitySort": 204}, {
            "CityID": 205,
            "CityName": "中山市",
            "ProID": 19,
            "CitySort": 205
        }, {"CityID": 206, "CityName": "河源市", "ProID": 19, "CitySort": 206}, {
            "CityID": 207,
            "CityName": "清远市",
            "ProID": 19,
            "CitySort": 207
        }, {"CityID": 208, "CityName": "云浮市", "ProID": 19, "CitySort": 208}, {
            "CityID": 209,
            "CityName": "潮州市",
            "ProID": 19,
            "CitySort": 209
        }, {"CityID": 210, "CityName": "东莞市", "ProID": 19, "CitySort": 210}, {
            "CityID": 211,
            "CityName": "兰州市",
            "ProID": 22,
            "CitySort": 211
        }, {"CityID": 212, "CityName": "金昌市", "ProID": 22, "CitySort": 212}, {
            "CityID": 213,
            "CityName": "白银市",
            "ProID": 22,
            "CitySort": 213
        }, {"CityID": 214, "CityName": "天水市", "ProID": 22, "CitySort": 214}, {
            "CityID": 215,
            "CityName": "嘉峪关市",
            "ProID": 22,
            "CitySort": 215
        }, {"CityID": 216, "CityName": "武威市", "ProID": 22, "CitySort": 216}, {
            "CityID": 217,
            "CityName": "张掖市",
            "ProID": 22,
            "CitySort": 217
        }, {"CityID": 218, "CityName": "平凉市", "ProID": 22, "CitySort": 218}, {
            "CityID": 219,
            "CityName": "酒泉市",
            "ProID": 22,
            "CitySort": 219
        }, {"CityID": 220, "CityName": "庆阳市", "ProID": 22, "CitySort": 220}, {
            "CityID": 221,
            "CityName": "定西市",
            "ProID": 22,
            "CitySort": 221
        }, {"CityID": 222, "CityName": "陇南市", "ProID": 22, "CitySort": 222}, {
            "CityID": 223,
            "CityName": "临夏回族自治州",
            "ProID": 22,
            "CitySort": 223
        }, {"CityID": 224, "CityName": "甘南藏族自治州", "ProID": 22, "CitySort": 224}, {
            "CityID": 225,
            "CityName": "成都市",
            "ProID": 28,
            "CitySort": 225
        }, {"CityID": 226, "CityName": "攀枝花市", "ProID": 28, "CitySort": 226}, {
            "CityID": 227,
            "CityName": "自贡市",
            "ProID": 28,
            "CitySort": 227
        }, {"CityID": 228, "CityName": "绵阳市", "ProID": 28, "CitySort": 228}, {
            "CityID": 229,
            "CityName": "南充市",
            "ProID": 28,
            "CitySort": 229
        }, {"CityID": 230, "CityName": "达州市", "ProID": 28, "CitySort": 230}, {
            "CityID": 231,
            "CityName": "遂宁市",
            "ProID": 28,
            "CitySort": 231
        }, {"CityID": 232, "CityName": "广安市", "ProID": 28, "CitySort": 232}, {
            "CityID": 233,
            "CityName": "巴中市",
            "ProID": 28,
            "CitySort": 233
        }, {"CityID": 234, "CityName": "泸州市", "ProID": 28, "CitySort": 234}, {
            "CityID": 235,
            "CityName": "宜宾市",
            "ProID": 28,
            "CitySort": 235
        }, {"CityID": 236, "CityName": "资阳市", "ProID": 28, "CitySort": 236}, {
            "CityID": 237,
            "CityName": "内江市",
            "ProID": 28,
            "CitySort": 237
        }, {"CityID": 238, "CityName": "乐山市", "ProID": 28, "CitySort": 238}, {
            "CityID": 239,
            "CityName": "眉山市",
            "ProID": 28,
            "CitySort": 239
        }, {"CityID": 240, "CityName": "凉山彝族自治州", "ProID": 28, "CitySort": 240}, {
            "CityID": 241,
            "CityName": "雅安市",
            "ProID": 28,
            "CitySort": 241
        }, {"CityID": 242, "CityName": "甘孜藏族自治州", "ProID": 28, "CitySort": 242}, {
            "CityID": 243,
            "CityName": "阿坝藏族羌族自治州",
            "ProID": 28,
            "CitySort": 243
        }, {"CityID": 244, "CityName": "德阳市", "ProID": 28, "CitySort": 244}, {
            "CityID": 245,
            "CityName": "广元市",
            "ProID": 28,
            "CitySort": 245
        }, {"CityID": 246, "CityName": "贵阳市", "ProID": 29, "CitySort": 246}, {
            "CityID": 247,
            "CityName": "遵义市",
            "ProID": 29,
            "CitySort": 247
        }, {"CityID": 248, "CityName": "安顺市", "ProID": 29, "CitySort": 248}, {
            "CityID": 249,
            "CityName": "黔南布依族苗族自治州",
            "ProID": 29,
            "CitySort": 249
        }, {"CityID": 250, "CityName": "黔东南苗族侗族自治州", "ProID": 29, "CitySort": 250}, {
            "CityID": 251,
            "CityName": "铜仁地区",
            "ProID": 29,
            "CitySort": 251
        }, {"CityID": 252, "CityName": "毕节地区", "ProID": 29, "CitySort": 252}, {
            "CityID": 253,
            "CityName": "六盘水市",
            "ProID": 29,
            "CitySort": 253
        }, {"CityID": 254, "CityName": "黔西南布依族苗族自治州", "ProID": 29, "CitySort": 254}, {
            "CityID": 255,
            "CityName": "海口市",
            "ProID": 20,
            "CitySort": 255
        }, {"CityID": 256, "CityName": "三亚市", "ProID": 20, "CitySort": 256}, {
            "CityID": 257,
            "CityName": "五指山市",
            "ProID": 20,
            "CitySort": 257
        }, {"CityID": 258, "CityName": "琼海市", "ProID": 20, "CitySort": 258}, {
            "CityID": 259,
            "CityName": "儋州市",
            "ProID": 20,
            "CitySort": 259
        }, {"CityID": 260, "CityName": "文昌市", "ProID": 20, "CitySort": 260}, {
            "CityID": 261,
            "CityName": "万宁市",
            "ProID": 20,
            "CitySort": 261
        }, {"CityID": 262, "CityName": "东方市", "ProID": 20, "CitySort": 262}, {
            "CityID": 263,
            "CityName": "澄迈县",
            "ProID": 20,
            "CitySort": 263
        }, {"CityID": 264, "CityName": "定安县", "ProID": 20, "CitySort": 264}, {
            "CityID": 265,
            "CityName": "屯昌县",
            "ProID": 20,
            "CitySort": 265
        }, {"CityID": 266, "CityName": "临高县", "ProID": 20, "CitySort": 266}, {
            "CityID": 267,
            "CityName": "白沙黎族自治县",
            "ProID": 20,
            "CitySort": 267
        }, {"CityID": 268, "CityName": "昌江黎族自治县", "ProID": 20, "CitySort": 268}, {
            "CityID": 269,
            "CityName": "乐东黎族自治县",
            "ProID": 20,
            "CitySort": 269
        }, {"CityID": 270, "CityName": "陵水黎族自治县", "ProID": 20, "CitySort": 270}, {
            "CityID": 271,
            "CityName": "保亭黎族苗族自治县",
            "ProID": 20,
            "CitySort": 271
        }, {"CityID": 272, "CityName": "琼中黎族苗族自治县", "ProID": 20, "CitySort": 272}, {
            "CityID": 273,
            "CityName": "西双版纳傣族自治州",
            "ProID": 30,
            "CitySort": 273
        }, {"CityID": 274, "CityName": "德宏傣族景颇族自治州", "ProID": 30, "CitySort": 274}, {
            "CityID": 275,
            "CityName": "昭通市",
            "ProID": 30,
            "CitySort": 275
        }, {"CityID": 276, "CityName": "昆明市", "ProID": 30, "CitySort": 276}, {
            "CityID": 277,
            "CityName": "大理白族自治州",
            "ProID": 30,
            "CitySort": 277
        }, {"CityID": 278, "CityName": "红河哈尼族彝族自治州", "ProID": 30, "CitySort": 278}, {
            "CityID": 279,
            "CityName": "曲靖市",
            "ProID": 30,
            "CitySort": 279
        }, {"CityID": 280, "CityName": "保山市", "ProID": 30, "CitySort": 280}, {
            "CityID": 281,
            "CityName": "文山壮族苗族自治州",
            "ProID": 30,
            "CitySort": 281
        }, {"CityID": 282, "CityName": "玉溪市", "ProID": 30, "CitySort": 282}, {
            "CityID": 283,
            "CityName": "楚雄彝族自治州",
            "ProID": 30,
            "CitySort": 283
        }, {"CityID": 284, "CityName": "普洱市", "ProID": 30, "CitySort": 284}, {
            "CityID": 285,
            "CityName": "临沧市",
            "ProID": 30,
            "CitySort": 285
        }, {"CityID": 286, "CityName": "怒江傈傈族自治州", "ProID": 30, "CitySort": 286}, {
            "CityID": 287,
            "CityName": "迪庆藏族自治州",
            "ProID": 30,
            "CitySort": 287
        }, {"CityID": 288, "CityName": "丽江市", "ProID": 30, "CitySort": 288}, {
            "CityID": 289,
            "CityName": "海北藏族自治州",
            "ProID": 25,
            "CitySort": 289
        }, {"CityID": 290, "CityName": "西宁市", "ProID": 25, "CitySort": 290}, {
            "CityID": 291,
            "CityName": "海东地区",
            "ProID": 25,
            "CitySort": 291
        }, {"CityID": 292, "CityName": "黄南藏族自治州", "ProID": 25, "CitySort": 292}, {
            "CityID": 293,
            "CityName": "海南藏族自治州",
            "ProID": 25,
            "CitySort": 293
        }, {"CityID": 294, "CityName": "果洛藏族自治州", "ProID": 25, "CitySort": 294}, {
            "CityID": 295,
            "CityName": "玉树藏族自治州",
            "ProID": 25,
            "CitySort": 295
        }, {"CityID": 296, "CityName": "海西蒙古族藏族自治州", "ProID": 25, "CitySort": 296}, {
            "CityID": 297,
            "CityName": "西安市",
            "ProID": 23,
            "CitySort": 297
        }, {"CityID": 298, "CityName": "咸阳市", "ProID": 23, "CitySort": 298}, {
            "CityID": 299,
            "CityName": "延安市",
            "ProID": 23,
            "CitySort": 299
        }, {"CityID": 300, "CityName": "榆林市", "ProID": 23, "CitySort": 300}, {
            "CityID": 301,
            "CityName": "渭南市",
            "ProID": 23,
            "CitySort": 301
        }, {"CityID": 302, "CityName": "商洛市", "ProID": 23, "CitySort": 302}, {
            "CityID": 303,
            "CityName": "安康市",
            "ProID": 23,
            "CitySort": 303
        }, {"CityID": 304, "CityName": "汉中市", "ProID": 23, "CitySort": 304}, {
            "CityID": 305,
            "CityName": "宝鸡市",
            "ProID": 23,
            "CitySort": 305
        }, {"CityID": 306, "CityName": "铜川市", "ProID": 23, "CitySort": 306}, {
            "CityID": 307,
            "CityName": "防城港市",
            "ProID": 21,
            "CitySort": 307
        }, {"CityID": 308, "CityName": "南宁市", "ProID": 21, "CitySort": 308}, {
            "CityID": 309,
            "CityName": "崇左市",
            "ProID": 21,
            "CitySort": 309
        }, {"CityID": 310, "CityName": "来宾市", "ProID": 21, "CitySort": 310}, {
            "CityID": 311,
            "CityName": "柳州市",
            "ProID": 21,
            "CitySort": 311
        }, {"CityID": 312, "CityName": "桂林市", "ProID": 21, "CitySort": 312}, {
            "CityID": 313,
            "CityName": "梧州市",
            "ProID": 21,
            "CitySort": 313
        }, {"CityID": 314, "CityName": "贺州市", "ProID": 21, "CitySort": 314}, {
            "CityID": 315,
            "CityName": "贵港市",
            "ProID": 21,
            "CitySort": 315
        }, {"CityID": 316, "CityName": "玉林市", "ProID": 21, "CitySort": 316}, {
            "CityID": 317,
            "CityName": "百色市",
            "ProID": 21,
            "CitySort": 317
        }, {"CityID": 318, "CityName": "钦州市", "ProID": 21, "CitySort": 318}, {
            "CityID": 319,
            "CityName": "河池市",
            "ProID": 21,
            "CitySort": 319
        }, {"CityID": 320, "CityName": "北海市", "ProID": 21, "CitySort": 320}, {
            "CityID": 321,
            "CityName": "拉萨市",
            "ProID": 31,
            "CitySort": 321
        }, {"CityID": 322, "CityName": "日喀则地区", "ProID": 31, "CitySort": 322}, {
            "CityID": 323,
            "CityName": "山南地区",
            "ProID": 31,
            "CitySort": 323
        }, {"CityID": 324, "CityName": "林芝地区", "ProID": 31, "CitySort": 324}, {
            "CityID": 325,
            "CityName": "昌都地区",
            "ProID": 31,
            "CitySort": 325
        }, {"CityID": 326, "CityName": "那曲地区", "ProID": 31, "CitySort": 326}, {
            "CityID": 327,
            "CityName": "阿里地区",
            "ProID": 31,
            "CitySort": 327
        }, {"CityID": 328, "CityName": "银川市", "ProID": 26, "CitySort": 328}, {
            "CityID": 329,
            "CityName": "石嘴山市",
            "ProID": 26,
            "CitySort": 329
        }, {"CityID": 330, "CityName": "吴忠市", "ProID": 26, "CitySort": 330}, {
            "CityID": 331,
            "CityName": "固原市",
            "ProID": 26,
            "CitySort": 331
        }, {"CityID": 332, "CityName": "中卫市", "ProID": 26, "CitySort": 332}, {
            "CityID": 333,
            "CityName": "塔城地区",
            "ProID": 24,
            "CitySort": 333
        }, {"CityID": 334, "CityName": "哈密地区", "ProID": 24, "CitySort": 334}, {
            "CityID": 335,
            "CityName": "和田地区",
            "ProID": 24,
            "CitySort": 335
        }, {"CityID": 336, "CityName": "阿勒泰地区", "ProID": 24, "CitySort": 336}, {
            "CityID": 337,
            "CityName": "克孜勒苏柯尔克孜自治州",
            "ProID": 24,
            "CitySort": 337
        }, {"CityID": 338, "CityName": "博尔塔拉蒙古自治州", "ProID": 24, "CitySort": 338}, {
            "CityID": 339,
            "CityName": "克拉玛依市",
            "ProID": 24,
            "CitySort": 339
        }, {"CityID": 340, "CityName": "乌鲁木齐市", "ProID": 24, "CitySort": 340}, {
            "CityID": 341,
            "CityName": "石河子市",
            "ProID": 24,
            "CitySort": 341
        }, {"CityID": 342, "CityName": "昌吉回族自治州", "ProID": 24, "CitySort": 342}, {
            "CityID": 343,
            "CityName": "五家渠市",
            "ProID": 24,
            "CitySort": 343
        }, {"CityID": 344, "CityName": "吐鲁番地区", "ProID": 24, "CitySort": 344}, {
            "CityID": 345,
            "CityName": "巴音郭楞蒙古自治州",
            "ProID": 24,
            "CitySort": 345
        }, {"CityID": 346, "CityName": "阿克苏地区", "ProID": 24, "CitySort": 346}, {
            "CityID": 347,
            "CityName": "阿拉尔市",
            "ProID": 24,
            "CitySort": 347
        }, {"CityID": 348, "CityName": "喀什地区", "ProID": 24, "CitySort": 348}, {
            "CityID": 349,
            "CityName": "图木舒克市",
            "ProID": 24,
            "CitySort": 349
        }, {"CityID": 350, "CityName": "伊犁哈萨克自治州", "ProID": 24, "CitySort": 350}, {
            "CityID": 351,
            "CityName": "呼伦贝尔市",
            "ProID": 5,
            "CitySort": 351
        }, {"CityID": 352, "CityName": "呼和浩特市", "ProID": 5, "CitySort": 352}, {
            "CityID": 353,
            "CityName": "包头市",
            "ProID": 5,
            "CitySort": 353
        }, {"CityID": 354, "CityName": "乌海市", "ProID": 5, "CitySort": 354}, {
            "CityID": 355,
            "CityName": "乌兰察布市",
            "ProID": 5,
            "CitySort": 355
        }, {"CityID": 356, "CityName": "通辽市", "ProID": 5, "CitySort": 356}, {
            "CityID": 357,
            "CityName": "赤峰市",
            "ProID": 5,
            "CitySort": 357
        }, {"CityID": 358, "CityName": "鄂尔多斯市", "ProID": 5, "CitySort": 358}, {
            "CityID": 359,
            "CityName": "巴彦淖尔市",
            "ProID": 5,
            "CitySort": 359
        }, {"CityID": 360, "CityName": "锡林郭勒盟", "ProID": 5, "CitySort": 360}, {
            "CityID": 361,
            "CityName": "兴安盟",
            "ProID": 5,
            "CitySort": 361
        }, {"CityID": 362, "CityName": "阿拉善盟", "ProID": 5, "CitySort": 362}, {
            "CityID": 363,
            "CityName": "台北市",
            "ProID": 32,
            "CitySort": 363
        }, {"CityID": 364, "CityName": "高雄市", "ProID": 32, "CitySort": 364}, {
            "CityID": 365,
            "CityName": "基隆市",
            "ProID": 32,
            "CitySort": 365
        }, {"CityID": 366, "CityName": "台中市", "ProID": 32, "CitySort": 366}, {
            "CityID": 367,
            "CityName": "台南市",
            "ProID": 32,
            "CitySort": 367
        }, {"CityID": 368, "CityName": "新竹市", "ProID": 32, "CitySort": 368}, {
            "CityID": 369,
            "CityName": "嘉义市",
            "ProID": 32,
            "CitySort": 369
        }, {"CityID": 370, "CityName": "澳门特别行政区", "ProID": 33, "CitySort": 370}, {
            "CityID": 371,
            "CityName": "香港特别行政区",
            "ProID": 34,
            "CitySort": 371
        }])
    //文化程度
    .constant('CULTURE',[
        '小学及以下',
        '初中',
        '高中',
        '中专及技校',
        '大学本科/专科',
        '研究生及以上'
    ])
    .constant('MARRIAGE',[
        '未婚',
        '已婚含同居',
        '丧偶',
        '离异',
        '其他'
    ])
    .constant('OCCUPATION',[
        '国家公务员',
        '专业技术人员',
        '职员',
        '工人',
        '农民',
        '学生'
    ])
    .constant('HEALTH',[
        '城镇职工医保',
        '城镇居民医保',
        '新农合医保',
        '其他',
        '无'
    ])
    .constant('VISIT',[
        '电话',
        '短信',
        '微信',
        '邮件',
        '面对面咨询（预约挂号）'
    ])
    .constant('SEX',[
        '男',
        '女'
    ])
    .factory('share',function(){
        var obj={};
        return{
            get:get,
            set:set
        };
        function set(objs,data){
            obj[data]=objs;
            sessionStorage.obj=JSON.stringify(obj);
        }
        function get(){
            obj=JSON.parse(sessionStorage.obj);
            return obj;
        }
    });







/**
 * Created by zrf on 2016/6/12.
 */
app.controller('loginController', ["$scope", "ipCookie", "$state", "alertify", "$http", "apiUrl", function ($scope, ipCookie, $state, alertify, $http, apiUrl) {
        var vm = $scope.vm = {};
        vm.url = apiUrl;
        $scope.data = {}
        $scope.auth = function () {
            $http.get(apiUrl + 'captcha').then(function (res) {
                $scope.pic = !$scope.pic;
                //console.log(res);
            })
        }
        $scope.login = function () {
            $http.post(apiUrl + 'customer_auth_check', $scope.data)
                .success(function (data) {
                    //console.log(data)
                    if (data.res == 'SUCCESS') {
                        ipCookie('user', data.data.userInfo)
                        ipCookie('card', data.data.cardInfo)
                        $state.go('loginPage');
                        //console.log(ipCookie('user').cardNumber);
                        alertify.success('登录成功')
                    } else if ('FAIT') {
                        alertify.error(data.error.message)
                    }
                })
        }
    }])
    .controller('loginPageController', ["$scope", "ipCookie", function ($scope, ipCookie) {
        var vm = $scope.vm = {};
        vm.card = ipCookie('card');
        vm.user = ipCookie('user');
        //vm.state = JSON.parse(sessionStorage.data);
        //console.log(vm.state);
        console.log(vm.card);
    }])
app.controller('historyController', ["$scope", "ipCookie", "$uibModal", "alertify", "apiUrl", "$http", function ($scope, ipCookie, $uibModal, alertify, apiUrl, $http) {
    var vm = $scope.vm = {};
    $scope.aaClick = function () {
        var a = $uibModal.open({
            templateUrl: './module/user/yuyue.html',
            controller: ["$scope", "ipCookie", "$uibModalInstance", function ($scope, ipCookie, $uibModalInstance) {
                var vm = $scope.vm = {};
                $scope.data = ipCookie('card');
                $scope.dismiss = function () {
                    $uibModalInstance.dismiss()
                };
                $scope.queding = function () {
                    $uibModalInstance.dismiss();
                    alertify.success('预约成功');
                }
                /*vm.res = {
                 "res": "SUCCESS",
                 "data": {
                 "capaData": [
                 {
                 "batchId": "578c41faa7e4689339d7d495",
                 "checkAreaName": "sdfsd",   //体检区名字
                 "capaDate": "2015-05-05T00:00:00.000Z",  //体检日期
                 "capaNum": 234,   //剩余名额
                 "agencyId": "测试科室",
                 "hospitalId": "222",
                 "centerId": "578c41faa7e4689339d7d495",
                 "isDelete": false,
                 "createdAt": "2016-07-23T06:37:43.903Z",
                 "updatedAt": "2016-07-23T06:37:43.903Z",
                 "id": "579310b7a854540c5f4ddda4"
                 },
                 {
                 "batchId": "578c41faa7e4689339d7d495",
                 "checkAreaName": "Niufyghu规范化",   //体检区名字
                 "capaDate": "2015-05-05T00:00:00.000Z",  //体检日期
                 "capaNum": 234,   //剩余名额
                 "agencyId": "测试科室",
                 "hospitalId": "222",
                 "centerId": "578c41faa7e4689339d7d495",
                 "isDelete": false,
                 "createdAt": "2016-07-23T06:37:43.903Z",
                 "updatedAt": "2016-07-23T06:37:43.903Z",
                 "id": "579310b7a854540c5f4ddda4"
                 },
                 {
                 "batchId": "578c41faa7e4689339d7d495",
                 "checkAreaName": "erutyjhuj",   //体检区名字
                 "capaDate": "2015-05-05T00:00:00.000Z",  //体检日期
                 "capaNum": 234,   //剩余名额
                 "agencyId": "测试科室",
                 "hospitalId": "222",
                 "centerId": "578c41faa7e4689339d7d495",
                 "isDelete": false,
                 "createdAt": "2016-07-23T06:37:43.903Z",
                 "updatedAt": "2016-07-23T06:37:43.903Z",
                 "id": "579310b7a854540c5f4ddda4"
                 }
                 ]
                 }
                 };*/
                //$scope.isOrder=true;
                vm.id = $scope.data.batchId;
                $http.get(apiUrl + 'user_order/' + vm.id).then(function (res) {
                    console.log(res);
                    vm.data = res.data.data;
                    console.log(vm.data);
                    vm.date = function () {
                        vm.capaNum = vm.data.filter(function (item) {
                            /*if (vm.time && vm.checkAreaName == "") {
                             }*/
                            console.log(typeof (vm.time && vm.checkAreaName));
                            return item.capaDate == vm.time && item.checkAreaName == vm.checkAreaName;
                        })
                        if (vm.capaNum[0].capaNum == 0) {
                            alertify.alert('预约人数已满，请修改预约时间！')
                        }
                    }
                })
            }]
        })
    }
    vm.card = ipCookie('card');
    console.log(vm.card);
    $http.get(apiUrl + 'card_history/' + vm.card.customerId).then(function (res) {
        vm.obj = res.data.data;
        vm.data = res.data.data.cardInfo;
        sessionStorage.data = JSON.stringify(vm.data);
    })
}])
app.controller('PhysicalController', ["$scope", "$http", "ipCookie", "apiUrl", function ($scope, $http, ipCookie, apiUrl) {
    var vm = $scope.vm = {};
    vm.card = ipCookie('card');
    console.log(vm.card);
    $scope.habit = 'illness';
    $scope.card = ipCookie('card');
    $http.get(apiUrl + "result?cardNumber=" + $scope.card.cardNumber + "&questionnaireId=" + $scope.card.questionnaireId).then(function (res) {
        $scope.dataR = res.data.data.items[0].section;
        console.log('答案', res)
        $scope.data = res.data.data.items[0].section[2].questions;
        $scope.data1 = res.data.data.items[0].section[1].questions;
        $scope.data2 = res.data.data.items[0].section[3].questions;
        $scope.data3 = res.data.data.items[0].section[4].questions;
        $scope.data4 = res.data.data.items[0].section[0].questions[0].answer;
        $scope.data5 = res.data.data.items[0].section[0].questions[1];
        $scope.data6 = res.data.data.items[0].section[0].questions[2];
        $scope.data7 = res.data.data.items[0].section[0].questions[3];
        $scope.data8 = res.data.data.items[0].section[0].questions[4];
        $scope.data9 = res.data.data.items[0].section[0].questions[5];
        $scope.data10 = res.data.data.items[0].section[0].questions[6];
        $scope.data11 = res.data.data.items[0].section[0].questions[7];
        $scope.data12 = res.data.data.items[0].section[0];
        console.log($scope.data12);
    })

}]);
app.controller('ReportController', ["$scope", "$http", "apiUrl", "ipCookie", function ($scope, $http, apiUrl, ipCookie) {
    var vm = $scope.vm = {};
    vm.hh = ipCookie('card');
    //console.log(vm.hh);
    vm.cardId = vm.hh.id;
    vm.datas = share.get().data;
    console.log(vm.datas);
    $http.post(apiUrl + 'report', {cardId: vm.cardId, questionnaireName: vm.report}).then(function (res) {
        vm.data = res.data.data;
        vm.sections = res.data.data.sections;
        console.log(vm.data);
    })
}]);
app.controller('comboController', ["$scope", "$uibModal", "alertify", function ($scope, $uibModal, alertify) {
    $scope.yyClick = function () {
        var a = $uibModal.open({
            templateUrl: './module/user/yuyue.html',
            controller: ["$scope", "ipCookie", "$uibModalInstance", function ($scope, ipCookie, $uibModalInstance) {
                $scope.data = ipCookie('card');
                console.log(ipCookie('card'));
                $scope.dismiss = function () {
                    $uibModalInstance.dismiss()
                };
                $scope.queding = function () {
                    $uibModalInstance.dismiss();
                    alertify.success('预约成功')
                }
            }]
        })
    }
}]);
app.controller('forgetController', ["$scope", "ipCookie", "alertify", "$http", "apiUrl", "$state", function ($scope, ipCookie, alertify, $http, apiUrl, $state) {
    var vm = $scope.vm = {};
    vm.url = apiUrl;
    //console.log(vm.data);
    vm.wjclick = function (boole) {
        console.log(vm.data);
        $http.post(apiUrl + 'find_password',vm.data
        ).then(function (res) {
            if (boole) {
                $state.go('sight');
            } else {
                alertify.alert("res.data.error.message")
            }
        })

    }
    $scope.authe = function () {
        $http.get(apiUrl + 'captcha').then(function (res) {
            $scope.pic = !$scope.pic;
            //console.log(res);
        })
    }
}])