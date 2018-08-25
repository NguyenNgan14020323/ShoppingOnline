
app.controller('homeCtrl', function ($scope, Data, myServices){

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
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

    Data.get('getAllProduct', 0, {}).then(function (result) {

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
                $scope.viewby = 12;
                $scope.totalItems = result.product.length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = $scope.viewby;
                $scope.maxSize = 12;
            }
        }
    });
      Data.get('getProductView', 0, {}).then(function (result) {

        if(result.status == 'error'){
            
        }else{
            $scope.listProductView = result;
        }
    });    

    $scope.addToBracket = id =>{
        var t = myServices.addProductoBracket(id, 1, $scope.$parent.father.bracket, 0)
        $scope.$parent.father.bracket = t
    }
});