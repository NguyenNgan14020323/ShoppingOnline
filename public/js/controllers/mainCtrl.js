app.controller('mainCtrl', function ($scope, $rootScope, $cookies, $window, Data){

    //check nummber
    $scope.father = {
        bracket: t = $cookies.get('br_n') != undefined ? t: 0,
        showLogin: true,
    }

    if($cookies.get('keepme') != undefined){

    	var user = {
            id: $cookies.get('id')
        }

    	Data.post('login', 1, user).then(function (result) {
            if(result.status == 'error'){
                alert(result.message)       
            }else{
                if (!result){
                    alert('login faild');
                } else {
                    $scope.showLogin = false;
                    $rootScope.username = result.name; 
                    var temp = result.name;
                    $window.sessionStorage.setItem("token", result.token);//global variable token
                    temp = temp.substr(0,1);
                    temp = temp.toUpperCase();
                    $rootScope.avatar = temp
                }

            }
         }); 
    }

    Data.get('getAllCatalog', 0, {}).then(function(data){
 
	        $rootScope.showSixCatalog = [];
	        $rootScope.showMore = [];
	        for (let i = 0; i < 6; i++){
	            $scope.showSixCatalog[i] = data[i];
	        }
	        let j = 0;
	        for (let i = 6; i < data.length; i++){
	            $rootScope.showMore[j++] = data[i];
	        }
	   
    })

});

//create my service stored and shared data between controllers
app.service("myServices", function($cookies, $window){
    var context = [];

    var addData = (key, value)=>{
        context.push({key:value})
    }

    var getData = key =>{
        return _.find(context, {
            key: key
        });
    }

    var numberWithCommas = x => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }



    return {
        addData: addData,
        getData: getData,
        numberWithCommas: numberWithCommas
    }

})