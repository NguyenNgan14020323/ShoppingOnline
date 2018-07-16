var app = angular.module('ShopApp', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngRoute', 'angular-md5']);

app.service('Data', ['$http', '$location', '$window',
    function ($http, $location, $window) {

        var _SERVICEBASE = 'http://localhost:3000/user/';

        var obj = {};

        obj.get = function (q) {
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");
            return $http.get(_SERVICEBASE + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");

            return $http.post(_SERVICEBASE + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");

            return $http.put(_SERVICEBASE + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.patch = function(q, object){
            return $http.put(_SERVICEBASE + q, object).then(function (results) {
                return results.data;
            });
        }
        obj.delete = function (q) {
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");

            return $http.delete(_SERVICEBASE + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);