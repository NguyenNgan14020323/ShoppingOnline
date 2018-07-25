app.controller('productDetailCtrl', function ($scope, $cookies, $stateParams, Data, myServices){
    
    var path = 'getproductDetail' + '/'+ $stateParams.product_id;
    const EX_TIMES = new Date(new Date().getTime() + 24*3600*1000*20), HOURS = 3600*6, MAX_PVIEW = 7
    $scope.amount = 1;

    Data.get(path, 0, {}).then(function (result) {
        if(result.status == 'error'){
           
        }else{  
           if (result.status == 404) {
			      
           } else {
              
               $scope.productDetail = result.productDetail[0];
               $scope.productDetail.discountMoney = myServices.numberWithCommas(($scope.productDetail.discount/100) * $scope.productDetail.price);
               $scope.productDetail.price = myServices.numberWithCommas($scope.productDetail.price - ($scope.productDetail.discount/100) * $scope.productDetail.price);
               $scope.productDetail.content = $scope.productDetail.content.split(',');

               var is_in_cart = false
               if($cookies.getObject('pd_ws') != undefined){
                 var products = JSON.parse($cookies.getObject('pd_ws'))
                 for(i = 0; i < products.length; i++){
                     if(products[i].id == result.productDetail[0]._id){
                        $scope.amount = products[i].amount
                        is_in_cart = true
                        break
                     }
                 }
               }

               if(!is_in_cart){

                  if(views.length > MAX_PVIEW){//so luong view moi san pham vuot qua MAX_PVIEW
                     //post to database, delete cookies
                     
                     $cookies.remove('cview')
                  }
                  
                  //count number of view for users
                  var views, date_now = new Date().getTime(), temp = [], flag = false, i = 0;

                  if($cookies.getObject('cview') != undefined)
                  {
                    views = JSON.parse($cookies.getObject('cview'))
                    for(i; i < views.length; i++){
                        if(views[i].id == result.productDetail[0]._id){
                           //checktime
                           var ind = (date_now - parseInt(views[i].time))/1000
                           if(ind - HOURS > 0){//moi lan truy cap lon hon 6h tinh la mot luot view
                              views[i].viewed++;
                              views[i].time = date_now
                           }
                           flag = true
                        }
                    }

                    if(!flag)
                       views.push({id: result.productDetail[0]._id, viewed: 1, time: new Date().getTime()})
                  }else{
                     views = [{
                        id: result.productDetail[0]._id,
                        viewed: 1,
                        time: new Date().getTime()
                     }]
                  }

                  console.log(views)

                  $cookies.putObject('cview', JSON.stringify(views), 
                        {secure:false, expires: EX_TIMES } )  
               }
            }
       }
   }); 

   $scope.addAmount = ()=>{
      $scope.amount++;
   }

   $scope.deAmount = ()=>{
      if($scope.amount > 1) 
         $scope.amount--;
   }

   $scope.addToBracket = id =>{

      var t = myServices.addProductoBracket(id, $scope.amount, $scope.$parent.father.bracket, 1), i,
          views = JSON.parse($cookies.getObject('cview')), temp = []
      $scope.$parent.father.bracket = t

      for(i = 0; i < views.length; i++){
         if(views[i].id != id)
            temp.push(views[i])
      }  

      if(temp.length > 0){
         $cookies.putObject('cview', JSON.stringify(temp), 
                  {secure:false, expires: EX_TIMES } )
      }else
         $cookies.remove('cview')
   }

});