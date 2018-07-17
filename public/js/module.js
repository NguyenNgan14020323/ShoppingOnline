var app = angular.module('ShopApp', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngRoute', 'angular-md5']);

app.service('Data', ['$http', '$location', '$window',
    function ($http, $location, $window) {

        const _SERVICEBASE1 = 'http://localhost:3000/api/';
        const _SERVICEBASE = 'http://localhost:3000/user/';

        var obj = {};

        obj.get = function (q, flag) {
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");
            if(flag==1)
                SERVICEBASE = _SERVICEBASE
            else
                SERVICEBASE = _SERVICEBASE1

            return $http.get(SERVICEBASE + q).then(function (results) {
                return results.data;
            });
        };

        obj.post = function (q, flag, object) {
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token")
            if(flag==1)
                SERVICEBASE = _SERVICEBASE
           else
               SERVICEBASE = _SERVICEBASE1    
            return $http.post(SERVICEBASE + q, object).then(function (results) {
                return results.data;
            });
        };

        obj.put = function (q, flag, object) {
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");
            if(flag==1)
                SERVICEBASE = _SERVICEBASE
            else
               SERVICEBASE = _SERVICEBASE1
            return $http.put(SERVICEBASE + q, object).then(function (results) {
                return results.data;
            });
        };

        obj.patch = function(q, object){
            return $http.put(_SERVICEBASE + q, object).then(function (results) {
                return results.data;
            });
        };

        obj.delete = function (q, flag) {
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");
            if(flag==1)
                SERVICEBASE = _SERVICEBASE
            else
               SERVICEBASE = _SERVICEBASE1
            return $http.delete(SERVICEBASE + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);