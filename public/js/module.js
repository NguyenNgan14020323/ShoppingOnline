var app = angular.module('ShopApp', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngRoute', 'angular-md5', 'slickCarousel']);

app.service('Data', ['$http', '$location', '$window', '$cookies',
    function ($http, $location, $window, $cookies) {

        var chooseUrl = flag=>{
        	if(flag == 1)
        		return 'http://localhost:8080/user/'
        	return 'http://localhost:8080/api/'
        }

        var obj = {};

        obj.get = function (q, flag, params) {
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");

            return $http.get(chooseUrl(flag) + q, params).then(function (results) {
                return results.data;
            });
        };

        obj.post = function (q, flag, object){
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token")
     
            object._csrftoken = $cookies.get('XSRF_TOKEN')
            return $http.post(chooseUrl(flag) + q, object).then(function (results) {
                return results.data;
            });
        };

        obj.put = function (q, flag, object) {
        	object._csrftoken = $cookies.get('XSRF_TOKEN')
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");
         
            return $http.put(chooseUrl(flag) + q, object).then(function (results) {
                return results.data;
            });
        };

        obj.patch = function(q, object){
        	object._csrftoken = $cookies.get('XSRF_TOKEN')
            return $http.put(_SERVICEBASE + q, object).then(function (results) {
                return results.data;
            });
        };

        obj.delete = function (q, flag, object) {
        	object._csrftoken = $cookies.get('XSRF_TOKEN')
            if(typeof $window.sessionStorage != undefined)
                $http.defaults.headers.common['token'] =  $window.sessionStorage.getItem("token");
            
            return $http.delete(chooseUrl(flag) + q, object).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);

//search product
app.filter("searchFor", function(){
	return function(arr, searchString){
		if(!searchString){
			return arr;
		}
		var result = [];
		searchString = searchString.toLowerCase();
		angular.forEach(arr, function(product){

			if(product.name.toLowerCase().indexOf(searchString) !== -1){
				result.push(product);
			} 
		});

		return result;
	}
}); 

//search product for price
app.filter("searchForPrice", function(){
	return function(arr, searchPrice){
		if(!searchPrice){
			return arr;
		}
		var result = [];
		searchPrice = searchPrice.toLowerCase();
		angular.forEach(arr, function(product){

			if(product.price.toLowerCase().indexOf(searchPrice) !== -1){
				result.push(product);
			}
			if(product.name.toLowerCase().indexOf(searchPrice) !== -1){
				result.push(product);
			} 
		});

		return result;
	}
}); 

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
const numberWithSpace = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const numberAfterSplit = (str, valSplit) =>{
	let result = str.split(valSplit);
	let newResult="";
	for(let i = 0; i < result.length; i++){
		newResult += result[i]; 
	}
	return parseInt(newResult, 10);
}
//handle click search form price to price
app.filter("searchOver", function(){
	return function(arr, overPrice){
		if(!overPrice) return arr;
		var result = [];
		if(overPrice == "Cancel") return arr;
		angular.forEach(arr, function(product){ 
			 
			if(numberAfterSplit(numberWithCommas(product.price), ".") 
				 > numberAfterSplit(numberWithCommas(overPrice), ".")){
				result.push(product);
			}  
		});
		return result;
	};
})

app.filter("searchUnder", function(){
	return function(arr, underPrice){
		if(!underPrice) return arr;
		var result = [];
		if(underPrice == "Cancel") return arr;
		angular.forEach(arr, function(product){ 
			 
			if(numberAfterSplit(numberWithCommas(product.price), ".") 
				< numberAfterSplit(numberWithCommas(underPrice), ".")){
				result.push(product);
			}  
		});
		return result;
	};
})