app.controller('mainCtrl', function ($scope, $rootScope, $cookies, Data){
    $rootScope.showLogin = true;

    if($cookies.get('keepme') != undefined){

    	var user = {
            id: $cookies.get('id')
        }

    	Data.post('login', user).then(function (result) {
            console.log(result)
            if(result.status == 'error'){
                alert(result.message)       
            }else{
                if (!result){
                    alert('login faild');
                } else {
                    $scope.showLogin = false;
                    $rootScope.username = result.name; 
                    var temp = result.name;
                    temp = temp.substr(0,1);
                    temp = temp.toUpperCase();
                    $rootScope.avatar = temp
                }
            }
         }); 
    }
});