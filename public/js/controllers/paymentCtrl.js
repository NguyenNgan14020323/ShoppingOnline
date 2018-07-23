app.controller('paymentCtrl', function ($scope, $window, $state){

	var checkToken = $window.sessionStorage.getItem('token')
    if(checkToken == undefined || checkToken == null){
    	$('#exampleModalCenter').modal({backdrop: 'static', keyboard: false})
    	$('#exampleModalCenter').modal('show');
    	$scope.$parent.father.showXModal = false;
    }
	
});