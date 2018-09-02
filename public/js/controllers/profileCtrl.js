
app.directive('changeName', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {

            function myValidation(value) {

               var nlength = /(?=.{6,30})/
               var nvalidate = /^[A-Za-z0-9_ @]{6,30}$/

               if (!nlength.test(value)) {
                    scope.editnameerror = "Tên tối thiểu dài 6 kí tự và tối đa 30 kí tự."
               }else{
                  if(value.match(nvalidate) == null)
                     scope.editnameerror = "Tên chỉ chứa kí tự Alphabet."
                  else
                     scope.editnameerror = ""
               }
               return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
       }
    };
   });

   //directive validate email
   app.directive('changeEmail',['Data', '$timeout', function(Data, $timeout) {
    return {

        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {

            function myValidation(value) {
               scope.notify = ""
               var evalidate = /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_])*@[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*$/

                if(value.length < 1)
                   scope.editemailerror = "Địa chỉ email bắt buộc.";

                if (!evalidate.test(value))
                    scope.editemailerror = "Địa chỉ email không đúng định dạng."
                else{
                    scope.editemailerror = "";
                    if(scope.userInfo.email === value){
                    	  scope.editemailerror = "";
                    }else{
	                     $timeout(function(){
	                        Data.post('checkUser', 1, { email: value }).then(function (result) {
	                           if(result.error){
	                              scope.editemailerror = result.message
	                           }else{
	                              scope.flagsendmail = false
	                              scope.editemailerror = ""
	                           }
	                        });
	                     }, 1000)
	                }  
                }

               return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
      }
     };
   }]);

    //directive validate adress
   app.directive('changeAddress', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {

            function myValidation(value) {

               var addvalidate = /.{6,}/
               if(!addvalidate.test(value))
               	scope.editaddresserror = "Địa chỉ liên hệ không chính xác."
               else
               	scope.editaddresserror = ""

               return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
        }
     };
   });

    //directive validate phone number
   app.directive('changePhone', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {

            function myValidation(value) {
               var phonevalidate = /(?:^(?:(?:(?:(?:\(\d{1,3}\)|d{1,3})(?:\d{1,2}(?:[.\/-])|\(\d{1,2}\)))|(?:\d{3}(?:[.\/-]))))\d{3}(?:[.\/-])\d{4}$)|(?:^\d{10,11}$)/
               if(!phonevalidate.test(value))
               	scope.editphoneerror = "Số điện thoại không chính xác."
               else
               	scope.editphoneerror = ""

               return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
        }
     };
   });

    //directive validate password
   app.directive('editchangePass', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {

            function myValidation(value) {

               var strongp = /(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9]+)(?=.*[!@#$%^&~*?^]+)(?=.{15,})/
               var mediump = /(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9]+)(?=.*[!@#$%^&~*?^]+)(?=.{10,})/
               var weakp = /(?=.{6,10})(?=.*[a-z]+)(?=.*[0-9]+)/

               if(!weakp.test(value)){
               	  scope.editnewpassworderror = "Mật khẩu có ít nhất một kí tự chữ, số và độ dài tối thiểu 6 kí tự."
               	  scope.editpasswordtype = ""
               }else{
               	  scope.editnewpassworderror = ""
               	  scope.editpasswordtype = "Mật khẩu yếu."
        				  scope.epassCol = "blue"
               	  if(mediump.test(value)){
               	  	   scope.editpasswordtype = "Mật khẩu mạnh trung bình."
               	  	   scope.epassCol = "orange"
               	  }
               	  if(strongp.test(value)){
               	  	   scope.editpasswordtype = "Mật khẩu rất rất mạnh."
               	  	   scope.epassCol = "green"
               	  }
               }

               return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
        }
     };
   });


   //directive validate n password
   app.directive('editchangeRepassword', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function myValidation(value) {
            	if(value != scope.userInfo.password.new)
            		scope.editconfirmpassworderror = "Mật khẩu xác nhận không trùng với mật khẩu đã nhập."
            	else
            		scope.editconfirmpassworderror = ""
            	
            	return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
        }
     };
   });


app.controller('profileCtrl', function ($scope, $cookies, $stateParams, Data, myServices, $state, $window, $interval){  

	$scope.flagsendmail = false;

	$scope.userInfo = {
		email: "",
		name: "",
		phone: "",
		address: "",
		id: "",
		password:{
			old: "",
			new: "", 
			confirm: ""
		}
	}	

	$scope.myVar = "info"
	Data.post('getinfor', 1, {type:"profile"}).then(function (result) {
      if(result.error){
         alert(result.error)
      }else{
        	$scope.userInfo.email = result.email
        	$scope.userInfo.name = result.name
        	$scope.userInfo.id = result.id,
        	$scope.userInfo.address =  result.address
        	$scope.userInfo.phone = result.phone
      }
   });

   $scope.olduserInfo = {}

   $scope.transaction = []

	$scope.myChoose = function(myVar){

		if(myVar == "changeInfo"){
			$scope.olduserInfo = {...$scope.userInfo}
		}else if(myVar == "changePass"){
			
		}else if(myVar == "order"){ //order
         //boostrap angular
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
			        	console.log($scope.transaction)
			      }
			   });
   		}else{
   			alert("Sometime wrong. Please login again.")
   		}
   	}
	}

	$scope.updateInfo = function(){

		if(JSON.stringify($scope.userInfo) !== JSON.stringify($scope.olduserInfo) &&
			($scope.editnameerror == "" || $scope.editnameerror == undefined) && 
			($scope.editphoneerror == "" || $scope.editphoneerror == undefined) && 
			($scope.editemailerror == "" || $scope.editemailerror == undefined) && 
			($scope.editaddresserror == "" || $scope.editaddresserror == undefined)){
			
         var user = {
            type: "information", 
            infouser: $scope.userInfo
         }

		   Data.post('updateUser', 1, user).then(function (result) {
			   if(result.data.error){
			      alert(result.data.message)
			   }else{
               alert("Cập nhật thông tin thành công.")
               console.log(result.data.data)
               $scope.userInfo.name = result.data.data.name
               $scope.userInfo.email = result.data.data.email
               $scope.userInfo.phone = result.data.data.phone
               $scope.userInfo.address = result.data.data.address
               $window.sessionStorage.setItem("token", result.data.data.token);
			      $window.location.reload();
			   }
			});
		}
	}

   $scope.editoldpassworderror = ""
	$scope.updatePassword = function(){

      if($scope.userInfo.password.old != "")
         $scope.editoldpassworderror = ""
      else
         $scope.editoldpassworderror = "Vui lòng nhập mật khẩu cũ."

		if(($scope.editoldpassworderror  == "" || $scope.editoldpassworderror == undefined) && 
			($scope.editnewpassworderror == "" || $scope.editnewpassworderror == undefined) && 
			($scope.editconfirmpassworderror == "" || $scope.editconfirmpassworderror == undefined)
			&& $scope.userInfo.password.new == $scope.userInfo.password.confirm &&
			$scope.userInfo.password.old != ""
		){
       
			Data.post('updateUser', 1, {type: "password", 
                        old: $scope.userInfo.password.old, new: $scope.userInfo.password.new})
		    .then(function (result) {
			   if(result.data.error){
               if(result.data.errcode == 1008)
			          $scope.editoldpassworderror = result.data.message
               else
                  alert($scope.editoldpassworderro)
			   }else{
			      alert(result.data.message)
               $window.location.reload();
			   }
			});
		}
	}

   $scope.enterOldPass = function(){
      $scope.editoldpassworderror = ""
   }

})