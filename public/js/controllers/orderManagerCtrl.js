app.controller('orderManagerCtrl', function ($scope, $cookies, $stateParams, Data, myServices, $state, $window, $interval){ 
	$('#myModal').modal({backdrop: 'static', keyboard: false})
  	$('#myModal').modal('show');
	if($cookies.get('id') !== undefined){
		Data.get('getTransaction', 0, {user_id: $cookies.get('id')}).then(function (result) {
		    if(result.error){
	        	$('#myModal').modal('hide');
		         alert(result.error)
		    }else{
	          	$('#myModal').modal('hide');
	          	$scope.transaction = result.data
	          	for(let i = 0; i < result.data.length; i++){
	            	$scope.transaction[i].orderInfo.index = i+1;
	        	}
	    	}
		});
	}

	$scope.deleteOrder = async function(order){
	     await Data.post('deleteOrder', 0, order).then(function(result){
	        if (result) {
	        $scope.myVar = "order"
	          alert("Hủy giao dịch thành công");
	          $window.location.reload();
	        } else {
	                $scope.myVar = "order"
	          alert("Hủy giao dịch thất bại");
	          $window.location.reload();
	        }
    	})
  	}
})

app.directive('ngConfirmClick', [
  function(){
    return {
      link: function (scope, element, attr) {
        var msg = attr.ngConfirmClick || "Are you sure?";
        var clickAction = attr.confirmedClick;
        element.bind('click',function (event) {
          if ( window.confirm(msg) ) {
            var order = {
              order_id: clickAction
            }
            scope.deleteOrder(order)
          }
        });
      }
    };
}])