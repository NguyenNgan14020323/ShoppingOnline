

app.controller('productCatalogCtrl', function ($scope, $rootScope, $stateParams, Data){

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    
     // var config = {
     //    params: {catalog_id: $stateParams.catalog_id}
     // }

     var path = 'productCatalog' + '/'+$stateParams.catalog_id
     Data.get(path, 0, {}).then(function (result) {

         // console.log(result)
         if(result.status == 'error'){
            
         }else{
             if (result.status == 404) {

            } else {
                $scope.listProduct = result.product;
                for (let i = 0; i < result.product.length; i++){
                    if ($scope.listProduct[i].discount != 0){
                        $scope.listProduct[i].discountMoney = numberWithCommas(($scope.listProduct[i].discount/100) * $scope.listProduct[i].price);
                        $scope.listProduct[i].price = numberWithCommas($scope.listProduct[i].price - ($scope.listProduct[i].discount/100) * $scope.listProduct[i].price);
                    }
                }
            }
        }
    });  
});