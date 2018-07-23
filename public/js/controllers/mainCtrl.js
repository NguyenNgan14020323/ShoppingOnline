app.controller('mainCtrl', function ($scope, $rootScope, $cookies, $window, Data){

    var total = 0
    //get all amount of products user register
    if($cookies.getObject('pd_ws') != undefined){
         var products = JSON.parse($cookies.getObject('pd_ws'))
         for(i = 0; i < products.length; i++)
            total += products[i].amount
    }

    $scope.father = {
        bracket: total,
        showLogin: true,
        cookieLg: new Date(new Date().getTime() + 24*3600*1000*20),
        showXModal: true
    }

    console.log("Alway run main. " + $scope.father.showXModal)

   //duy tri trang thai dang nhap neu con phien giao dich
    var checkToken = $window.sessionStorage.getItem('token')
    if( checkToken !== undefined && checkToken !== null){

      Data.post('keepstate', 1, {token: checkToken}).then(function (result) {
            if(result.status == 'error'){
                alert(result.message)       
            }else{
                if (!result){
      
                } else {
                    $scope.father.showLogin = false;
                    $rootScope.username = result.name; 
                    var temp = result.name;
                    temp = temp.substr(0,1);
                    temp = temp.toUpperCase();
                    $rootScope.avatar = temp
                }

            }
         });
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
                    $scope.father.showLogin = false;
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
    const EX_TIMES = new Date(new Date().getTime() + 24*3600*1000*20)

    var addData = (key, value)=>{
      context.push( { key: key, 
                      value : value } )
    }

    var getData = key =>{
       for(i = 0; i < context.length; i++){
         if(key == context[i].key){
            return context[i].value
         }
    }

      return null
    }

    var setData = (key, value)=>{
       f = false
       for(i = 0; i < context.length; i++)
         if(key == context[i].key){
            f = true
            context[i].value = value
            break
         }

      if(!f){
         addData(key, value)
      }
    }

    var numberWithCommas = x => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    var changeStrToNum = x =>{
       return x.toString().replace(/\D/g, "");
    }

    var addProductoBracket = (id, amount, bracket, type) => {

        if($cookies.getObject('pd_ws') !== undefined)
        {     
         //check list in cookie
            var products = JSON.parse($cookies.getObject('pd_ws')), flag = false

            for(i = 0; i < products.length; i ++){
               if(products[i].id == id){
                  flag = true;
                  if(type == 1){
                     bracket -= products[i].amount;
                     products[i].amount = amount;
                  }else //type = 0, add more amount of product
                     products[i].amount += amount;
                     
                  break;
               }
            }
            //add new products
            if(!flag)   products.push({id: id, amount: amount, ischoosed:true})
   
         }else
         {
            var products = [{
               id: id,
               amount: amount,
               ischoosed: true//customer is choose products...
            }]
         }

          bracket += amount;
          $cookies.putObject('pd_ws', JSON.stringify(products), 
               {secure:false, expires: EX_TIMES } )

         return bracket

        // setData("bracket", bracket)
      }

    return {
        addData: addData,
        getData: getData,
        setData: setData,
        numberWithCommas: numberWithCommas,
        addProductoBracket: addProductoBracket,
        changeStrToNum: changeStrToNum
    }

})