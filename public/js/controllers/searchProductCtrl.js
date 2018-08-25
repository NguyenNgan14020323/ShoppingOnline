app.controller('searchProductCtrl', function ($scope, $rootScope, $stateParams, Data, myServices){
   
     // var config = {
     //    params: {catalog_id: $stateParams.catalog_id}
     // }
     // 
     $scope.setPage = function(pageNo){
      $scope.currentPage = pageNo;
    }

    $scope.pageChanged = function() {
      console.log('Page changed to: ' + $scope.currentPage);
    }

    $scope.setItemsPerPage = function(num){
      $scope.itemsPerPage = num;
      $scope.currentPage = 1;
    }
     var path = 'searchProduct' + '/'+$rootScope.searchString;
         Data.get(path, 0, {}).then(function (result) {

             // console.log(result)
             if(result.status == 'error'){
                
             }else{
                 if (result.status == 404) {

                } else {
                    $scope.listProduct = result.product;
                    console.log(result.product);
                    for (let i = 0; i < result.product.length; i++){
                        if ($scope.listProduct[i].discount != 0){
                            $scope.listProduct[i].discountMoney = myServices.numberWithCommas(($scope.listProduct[i].discount/100) * $scope.listProduct[i].price);
                            $scope.listProduct[i].price = myServices.numberWithCommas($scope.listProduct[i].price - ($scope.listProduct[i].discount/100) * $scope.listProduct[i].price);
                        }
                    }
                      $scope.viewby = 12;
                $scope.totalItems = result.product.length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = $scope.viewby;
                $scope.maxSize = 12;
                    
                }
            }
        }); 
     $scope.addToBracket = id =>{
        var t = myServices.addProductoBracket(id, 1, $scope.$parent.father.bracket, 0)
        $scope.$parent.father.bracket = t
    }

	$scope.under_prices = ["Cancel","1.000.000", "3.000.000", "5.000.000", "10.000.000", "15.000.000", "20.000.000", "25.000.000", "30.000.000", "50.000.000", "100.000.000"];
	$scope.over_prices = ["Cancel","1.000.000", "3.000.000", "5.000.000", "10.000.000", "15.000.000", "20.000.000", "25.000.000", "30.000.000", "50.000.000", "100.000.000"];
});