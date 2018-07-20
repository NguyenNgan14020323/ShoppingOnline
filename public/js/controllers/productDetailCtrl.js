app.controller('productDetailCtrl', function ($scope, $stateParams, Data){
    
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    var path = 'getproductDetail' + '/'+ $stateParams.product_id;
    Data.get(path, 0, {}).then(function (result) {
        if(result.status == 'error'){
           
        }else{  
           if (result.status == 404) {
			
           } else {
               $scope.productDetail = result.productDetail[0];
               $scope.productDetail.discountMoney = numberWithCommas(($scope.productDetail.discount/100) * $scope.productDetail.price);
               $scope.productDetail.price = numberWithCommas($scope.productDetail.price - ($scope.productDetail.discount/100) * $scope.productDetail.price);
               $scope.productDetail.content = $scope.productDetail.content.split(',');
           }
       }
   });    
});