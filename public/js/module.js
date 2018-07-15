var app = angular.module('ShopApp', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngRoute', 'angular-md5']);

app.service('Data', ['$http', '$location',
    function ($http, $q, $location) {

        var serviceBase = 'http://localhost:3000/api/';

        var obj = {};

        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            console.log('done');
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.patch = function(q, object){
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        }
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);