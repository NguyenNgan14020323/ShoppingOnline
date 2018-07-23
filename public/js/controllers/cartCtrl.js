
app.controller("cartCtrl", function($scope, $cookies, $state, Data, myServices){

	$scope.checked = false;
	$scope.total = 0;
	$scope.alltotal = 0;
	$scope.shipfee = 0;
	$scope.numofpd = 0;
	const PERCENT = 0.005, EX_TIMES = new Date(new Date().getTime() + 24*3600*1000*20);

	var updateInfo = ()=>{

		$scope.total = 0;
		$scope.alltotal = 0;
		$scope.shipfee = 0;
		$scope.numofpd = 0;
		var products = []

		for (let i = 0; i <  $scope.listProduct.length; i++){

			products[i] = {
				id: $scope.listProduct[i]._id,
				amount: $scope.listProduct[i].amount,
				ischoosed: $scope.listProduct[i].ischecked
			}

			if($scope.listProduct[i].ischecked){
			 	$scope.numofpd += $scope.listProduct[i].amount
	       	$scope.total += $scope.listProduct[i].amount 
	       	                 * parseInt(myServices.changeStrToNum($scope.listProduct[i].price))
	      }

		}
	
		$scope.shipfee = parseInt(PERCENT*$scope.total)
      $scope.alltotal = numberWithCommas(($scope.shipfee + $scope.total));
      $scope.total = numberWithCommas($scope.total)
      $scope.shipfee = numberWithCommas($scope.shipfee)

       $cookies.putObject('pd_ws', JSON.stringify(products), 
                 {secure: false, expires: EX_TIMES})
	}

	//take cookies
	if($cookies.get('pd_ws') !== undefined){

		Data.get('cartProduct', 0, {}).then(function (result) {

	        if(result.status == 'error'){
	            alert("Xay ra loi.")
	        }else{

	        		var listcookies = JSON.parse(JSON.parse($cookies.get('pd_ws'))),
	        		    count = 0, afterSale = 0;
	            if(result.status == 200) {
	               $scope.listProduct = result.listProduct;
	           
	               for (let i = 0; i <  $scope.listProduct.length; i++)
	               {
	                  $scope.listProduct[i].amount = listcookies[i].amount
	                  $scope.listProduct[i].show = true
	                  $scope.listProduct[i].ischecked = listcookies[i].ischoosed
	                  

                     if ($scope.listProduct[i].discount != 0){
                     	afterSale = ($scope.listProduct[i].discount/100) * $scope.listProduct[i].price
                        $scope.listProduct[i].discountMoney = numberWithCommas(afterSale);
                        $scope.listProduct[i].price = numberWithCommas($scope.listProduct[i].price - afterSale);
                     }

                     if($scope.listProduct[i].ischecked){ //count products was choosen
	                  	count++
                     	$scope.numofpd += $scope.listProduct[i].amount 
	                 	   $scope.total += $scope.listProduct[i].amount 
	       	                            * parseInt(myServices.changeStrToNum($scope.listProduct[i].price))
	                 	}

                  }

                  if(count == listcookies.length) $scope.checked = true

                  $scope.shipfee = parseInt(PERCENT*$scope.total)
                  $scope.alltotal = numberWithCommas($scope.shipfee  + $scope.total);
                  $scope.total = numberWithCommas($scope.total)
                  $scope.shipfee = numberWithCommas($scope.shipfee)
                 
	            }
	        }
    	});  
	}

	$scope.chooseAllPd = ()=>{
		$scope.checked = !$scope.checked;

		if($scope.checked){
			for(let i = 0; i < $scope.listProduct.length; i++){
				$scope.listProduct[i].ischecked = true//check all
			}

	      updateInfo()
		}else{
			for(let i = 0; i < $scope.listProduct.length; i++){
				$scope.listProduct[i].ischecked = false//uncheck all
			}

			$scope.total = 0;
		   $scope.shipfee = 0;
	      $scope.numofpd = 0;
	      $scope.alltotal = 0;
		}
	}


	$scope.addAmount = id=>{
	//	console.log("tang " + id)
		for(let i = 0; i < $scope.listProduct.length; i++){
			if(id == $scope.listProduct[i]._id){
				$scope.numofpd++;
				$scope.listProduct[i].amount++;
				$scope.$parent.father.bracket++;
				break;
			}
		}
		updateInfo()
	}


	$scope.deAmount = id=>{
		var flag = false
	//	console.log("giam " + id)
 		for(let i = 0; i < $scope.listProduct.length; i++){
			if(id == $scope.listProduct[i]._id && $scope.listProduct[i].amount > 1){
				$scope.numofpd--;
				$scope.listProduct[i].amount--;
				$scope.$parent.father.bracket--;
				flag = true;
				break;
			}
		}

		if(flag)  updateInfo()
	}


	$scope.deletePd = id=>{

		var r = confirm("Bạn có đồng ý loại bỏ sản phẩm này khỏi đơn hàng?")
		if(r){

			for (let i = 0; i <  $scope.listProduct.length; i++){
		   	if($scope.listProduct[i]._id == id){
		   		$scope.listProduct[i].show = false//an gia tri
		   		$scope.$parent.father.bracket-= $scope.listProduct[i].amount
		   		$scope.listProduct.splice(i, 1)//xoa gia tri
		   		break;
		   	}
		   }

		   updateInfo()
		}
	}


	$scope.checkspecificPd = id =>{
		var count = 0
		for (let i = 0; i <  $scope.listProduct.length; i++){
			if($scope.listProduct[i]._id == id){
				$scope.listProduct[i].ischecked = !$scope.listProduct[i].ischecked;
			}
			if($scope.listProduct[i].ischecked) count++
		}

		if(count == $scope.listProduct.length) $scope.checked = true
		else  $scope.checked = false
		updateInfo()
	}


	$scope.confirmCart = ()=>{

		if($scope.numofpd == 0){
			alert("Bạn chưa mua sản phẩm nào. Vui lòng chọn mua sản phẩm.")
		}else{

			 var infor = []

			 for(let i = 0; i < $scope.listProduct.length; i++){
			 	if($scope.listProduct[i].ischecked){
			 		infor[i] = {
			 			id: $scope.listProduct[i]._id,
			 			amount: $scope.listProduct[i].amount,
			 			price: $scope.listProduct[i].price,
			 			discount: $scope.listProduct[i].discountMoney
			 		}
			 	}
			 }

			Data.post('buyProduct', 0, {infor: infor}).then(function(result) {
			 	if(result.error){
					 $('#exampleModalCenter').modal('show');
			 	}else{
			 		 $state.go('payment', '')
			 	}
	        })
			
			
			

		}
	}

})