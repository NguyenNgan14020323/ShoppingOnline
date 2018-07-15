app.controller('mainCtrl', function ($scope, $rootScope, $cookies, Data){
    $rootScope.showLogin = true;

    if($cookies.get('keepme') != undefined){

    	var user = {
            email: $cookies.get('email'), 
            password: $cookies.get('password')
        }

    	Data.post('login', user).then(function (result) {
            if(result.status == 'error'){
                       
            }else{
                if (!result){
                    alert('login faild');
                } else {
                    $scope.showLogin = false;
                    $rootScope.username = result.name; 
                }
            }
         });  
    }
});