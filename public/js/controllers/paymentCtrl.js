


app.directive('paymentName',function() {
	return {
	  	require: 'ngModel',
      link: function(scope, element, attr, mCtrl) {
      	function myValidation(value) {

            var nlength = /(?=.{6,30})/
            var nvalidate = /^[A-Za-z0-9_ @]{6,30}$/

            if (!nlength.test(value)) {
                    scope.step1.errorName = "Tên tối thiểu dài 6 kí tự và tối đa 30 kí tự."
            }else{
               if(value.match(nvalidate) == null)
                  scope.step1.errorName = "Tên chỉ chứa kí tự Alphabet."
               else
                  scope.step1.errorName = ""
            }
            return value;//dùng trong scope ở controller
         }

         mCtrl.$parsers.push(myValidation);
      }
	}
})

app.directive('paymentCreditnumber',function() {
	return {
	  	require: 'ngModel',
      link: function(scope, element, attr, mCtrl) {
      	function myValidation(value) {

            var nlength = /(?=.{16,19})/
            var nvalidate = /^[0-9]{16,19}$/

            if (!nlength.test(value)) {
                    scope.step2.paymentOnCredit.errorNumber = "Số thẻ tối thiểu dài 16 và tối đa 19 kí tự."
            }else{
               if(value.match(nvalidate) == null)
                  scope.step2.paymentOnCredit.errorNumber= "Số thẻ chỉ chứa kí tự số, hoặc vượt quá độ dài."
               else
                  scope.step2.paymentOnCredit.errorNumber = ""
            }
            return value;//dùng trong scope ở controller
         }

         mCtrl.$parsers.push(myValidation);
      }
	}
})

app.directive('paymentCreditname',function() {
	return {
	  	require: 'ngModel',
      link: function(scope, element, attr, mCtrl) {
      	function myValidation(value) {

            var nlength = /(?=.{3,10})/
            var nvalidate = /^[A-Za-z]{3,10}$/

            if (!nlength.test(value)) {
               scope.step2.paymentOnCredit.errorName = "Tên thẻ tối thiểu dài 3 và tối đa 10 kí tự."
            }else{
               if(value.match(nvalidate) == null)
                  scope.step2.paymentOnCredit.errorName= "Tên thẻ chỉ chứa kí tự hoa - thường."
               else
                  scope.step2.paymentOnCredit.errorName = ""
            }
            return value;//dùng trong scope ở controller
         }

         mCtrl.$parsers.push(myValidation);
      }
	}
})


app.directive('paymentCreditcvv',function() {
	return {
	  	require: 'ngModel',
      link: function(scope, element, attr, mCtrl) {
      	function myValidation(value) {

            var nlength = /(?=.{3,6})/
            var nvalidate = /^[0-9]{3,6}$/

            if (!nlength.test(value)) {
                    scope.step2.paymentOnCredit.errCard_Cerification = "Số CVV tối thiểu dài 3 và tối đa 6 kí tự."
            }else{
               if(value.match(nvalidate) == null)
                  scope.step2.paymentOnCredit.errCard_Cerification= "Số CVV chỉ chứa kí tự số."
               else
                  scope.step2.paymentOnCredit.errCard_Cerification = ""
            }
            return value;//dùng trong scope ở controller
         }

         mCtrl.$parsers.push(myValidation);
      }
	}
})

app.directive('paymentCreditexp',function() {
	return {
	  	require: 'ngModel',
      link: function(scope, element, attr, mCtrl) {
      	function myValidation(value) {

            var nvalidate = /^[0-9]{1,2}([/\-.])[0-9]{1,2}\1[0-9]{4}$/

            if (!nvalidate.match(value) == null) {
                  scope.step2.paymentOnCredit.errorExpires = "Sai định dạng ngày tháng."
            }else{
            	date = value.split(value.match(/[/\-.]/)[0])
            	var cDate = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]))
            	if(parseInt(date[2]) !== cDate.getFullYear() || 
            		parseInt(date[0]) !== cDate.getDate() || parseInt(date[1]) !== cDate.getMonth()+1){
            		scope.step2.paymentOnCredit.errorExpires = "Ngày tháng không chính xác."
            	}else{
            		scope.step2.paymentOnCredit.errorExpires = ""
            	}
               
            }
            return value;//dùng trong scope ở controller
         }

         mCtrl.$parsers.push(myValidation);
      }
	}
})

//directive validate phone number
   app.directive('paymentPhone', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function myValidation(value) {
               var phonevalidate = /(?:^(?:(?:(?:(?:\(\d{1,3}\)|d{1,3})(?:\d{1,2}(?:[.\/-])|\(\d{1,2}\)))|(?:\d{3}(?:[.\/-]))))\d{3}(?:[.\/-])\d{4}$)|(?:^\d{10,11}$)/
               if(!phonevalidate.test(value))
               	  scope.step1.errorPhone = "Số điện thoại không chính xác."
               else
               	  scope.step1.errorPhone = ""

               return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
        }
     };
   });


 //directive validate adress
   app.directive('paymentAddress', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {

            function myValidation(value) {

               var addvalidate = /.{6,}/
               if(!addvalidate.test(value))
               	scope.step1.errorAddress = "Địa chỉ liên hệ không chính xác."
               else
               	scope.step1.errorAddress = ""

               return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
        }
     };
   });


app.controller('paymentCtrl', function ($scope, $window, $state, $cookies, Data){

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

    //object
	 function Step1(show, name, phone, address, message){
	    this.show =  show;
	    this.name = name;
	    this.phone = phone;
	    this.address = address;
	    this.message = message;

	    this.errorName = "";
	    this.errorPhone = "";
	    this.errorAddress = "";
	    this.erroMessage = "";

	    this.nextStep = ()=>{
	    	if(this.checkNull(this.errorName) && this.checkNull(this.erroMessage)
	    		 && this.checkNull(this.errorAddress)  && this.checkNull(this.errorPhone))
	    	 	return true
	    	return false
	    },

	    this.checkNull = a =>{
	    	if(a== "" || a == undefined) return true
	    	return false
	    },

	    this.currStep = ()=>{
	    	if(this.checkNull(this.name) || this.checkNull(this.phone) 
	    		|| this.checkNull(this.address)){
	    		if(this.checkNull(this.name))
	    			this.errorName = "Không để trống trường name này."
	    		if(this.checkNull(this.phone) )
	    			this.errorPhone = "Không để trống trường phone này."
	    		if(this.checkNull(this.address))
	    			this.errorAddress = "Không để trống trường address này."

	    		return false
	    	}

	    	if(!this.checkNull(this.errorName) || !this.checkNull(this.erroMessage)
	    		 || !this.checkNull(this.errorAddress)  || !this.checkNull(this.errorPhone))
	    		return false

	    	return true
	    }
	 }

	 //object
	$scope.step2 = {
	   show: false,
	 
	   paymentOnDelivery:{
	    	ischoose: false,//$scope.payment.type,
	    	infor:"Thanh toan khi nhan hang."
	   },

	   paymentOnCredit:{
	    	ischoose: false,//$scope.payment.type,
	    	number: 00000000000000000000,
	    	name: "",
	    	expires: "00/00/00",
	    	card_cerification_value: 0000,

	    	errorNumber: "",
	    	errorName: "",
	    	errorExpires: "",
	    	errCard_Cerification: ""

	   },
	   errorAll: "",
	   checkNull: function(a){
	    	if(a == "" || a == undefined) return true
	    	return false
	    },
	   nextStep: function(){
	   	if(this.paymentOnDelivery.ischoose)
		      return true

	   	if(this.paymentOnCredit.ischoose){
	   		if(this.checkNull(this.paymentOnCredit.errorNumber) && this.checkNull(this.paymentOnCredit.errorName) 
	   			&& this.checkNull(this.paymentOnCredit.errorExpires)
	   			&& this.checkNull(this.paymentOnCredit.errCard_Cerification))
		    	 	return true
	   	}

	    	return false
	   }, 

	   currStep: function(){
	   	if(!this.paymentOnCredit.ischoose && !this.paymentOnCredit.ischoose){
	   		this.errorAll = "Vui lòng chọn một trong hai hình thức thanh toán."
	   		return false
	   	}

	   	if(this.paymentOnCredit.ischoose){
	   		this.errorAll = ""
	   		if(this.checkNull(this.paymentOnCredit.number)|| this.checkNull(this.paymentOnCredit.name) 
	   			 || this.checkNull(this.paymentOnCredit.expires) || 
	   			 this.checkNull(this.paymentOnCredit.card_cerification_value)){
	   			if(this.checkNull(this.paymentOnCredit.number))
	    				this.paymentOnCredit.errorNumber = "Không để trống trường number này."
	    			if(this.checkNull(this.paymentOnCredit.name))
	    				this.paymentOnCredit.errorName = "Không để trống trường name này."
	    			if(this.checkNull(this.paymentOnCredit.expires))
	    				this.paymentOnCredit.errorExpires = "Không để trống trường expires này."
	    			if(this.checkNull(this.paymentOnCredit.card_cerification_value))
	    				this.paymentOnCredit.errCard_Cerification = "Không để trống trường CCV này."

	   			return false
	   		}

	   		if(!this.checkNull(this.paymentOnCredit.errorNumber) || !this.checkNull(this.paymentOnCredit.errorName) 
	   			|| !this.checkNull(this.paymentOnCredit.errorExpires)
	   			|| !this.checkNull(this.paymentOnCredit.errCard_Cerification))
		    	 	return false

	   	} 	

	   	if(this.paymentOnDelivery.ischoose)
	   		this.errorAll = ""

	   	return true
	   }

	}

	 //object   
	$scope.step3 = {
	   show: false,
	   elements:{
	     agree: false,
	     newsletter:false,
	     errorAgree: ""
	   },

	   nextStep:()=>{
	   	if(this.elements.agree)
	   		return true
	   	return false;
	   },

	   currStep:()=>{
	   	if(!this.elements.agree){
	   		this.elements.errorAgree = "Nếu không đồng ý với các điều khoản của chúng tôi, "+
	   		                          "vui lòng để lại phản hồi."
	   		return false
	   	}

	   	return true
	   }

	}

   //object
	$scope.step4 = {
	   show: false,
	   finish: ()=>{
	   	if($scope.step1.nextStep() && $scope.step2.nextStep() && $scope.step3.nextStep())
	   		return true
	   	return false
	   }
	}

	//events
	$scope.events = {
		step1: {
			event:()=>{
				$scope.step1.show = true
				$scope.step2.show = false
				$scope.step3.show = false
				$scope.step4.show = false
			},
			next:()=>{
				if($scope.step1.currStep()){
					$scope.step1.show = false
					$scope.step2.show = true
				}
			}
		},
		step2: {
			event:()=>{
				$scope.step2.show = true
				$scope.step1.show = false
				$scope.step3.show = false
				$scope.step4.show = false
			},
			next:()=>{
				if($scope.step2.currStep()){
					$scope.step3.show = true
					$scope.step2.show = false
				}
			},
			previous:()=>{
				$scope.step1.show = true
				$scope.step2.show = false
			}
		},
		step3: {
			event:()=>{
				$scope.step3.show = true
				$scope.step1.show = false
				$scope.step2.show = false
				$scope.step4.show = false
			},
			next:()=>{
				$scope.step4.show = true
				$scope.step3.show = false
			},
			previous:()=>{
				$scope.step2.show = true
				$scope.step3.show = false
			}
		},
		step4:{
			event:()=>{
				$scope.step4.show = true
				$scope.step1.show = false
				$scope.step2.show = false
				$scope.step3.show = false
			},
			finish:()=>{
				//big things

			},
			previous:()=>{
            $scope.step3.show = true
				$scope.step4.show = false
			}
		}
	}
	
	//constructor
	$scope.step1 = new Step1(true, "", "", "", "")
	Data.post('getinfor', 1, {}).then(function(result){
		if(result.status == "error"){
			alert(result.message)
		}else{
			$scope.step1 = new Step1(true, result.name, result.phone, result.address,"")
		}
	})

});