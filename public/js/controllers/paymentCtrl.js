app.controller('paymentCtrl', function ($scope, $window, $state, $cookies){

	var checkToken = $window.sessionStorage.getItem('token')

    if(checkToken == undefined || checkToken == null){
    	$('#exampleModalCenter').modal({backdrop: 'static', keyboard: false})
    	$('#exampleModalCenter').modal('show');
    	$scope.$parent.father.showXModal = false;
    }

    var getCookie = $cookies.getObject('pd_ws')
 
    if( getCookie == undefined || getCookie == null || getCookie.length < 3){
    	var r = confirm("Bạn chưa chọn sản phẩm nào. Vui lòng chọn sản phẩm để mua.")
    	if(r){
    		$state.go('home', '')
    	}else{
    		$state.go('cart', '')
    	}
    }

    //dosomething...
    
	
});