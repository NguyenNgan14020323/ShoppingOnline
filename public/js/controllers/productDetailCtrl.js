app.controller('productDetailCtrl', function ($scope, $cookies, $stateParams, Data, myServices){
    
    var path = 'getproductDetail' + '/'+ $stateParams.product_id;

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
      $scope.$parent.father.bracket = $scope.amount;

   }

});