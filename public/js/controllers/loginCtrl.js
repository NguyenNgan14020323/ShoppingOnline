 // //controller
   app.controller('loginCtrl', function($scope, $rootScope, $cookies, $window, Data){
      //login general
      $scope.Login = function(){

         if($scope.email == undefined || $scope.email==""){
            if($scope.emailerror == undefined || $scope.emailerror == "")
               $scope.emailerror = "Địa chỉ email bắt buộc.";
         }

         if($scope.password == undefined || $scope.password == ""){
            if($scope.passworderror == undefined || $scope.passworderror == "")
               $scope.passworderror = "Mật khẩu bắt buộc."
         }

         if($scope.email != "" && $scope.password != "" 
             && $scope.emailerror == "" && $scope.passworderror == ""){

               var user = {
                    email: $scope.email, 
                    password: $scope.password
                }

                Data.post('login', user).then(function (result) {
                    if(result.status == 'error'){
                       
                    }else{
                        if (!result){
                            alert('login faild');
                        } else {
                           console.log(result.name)
                           $scope.showLogin = false;
                           $rootScope.username = result.name; 
                           if($scope.keepme != undefined){
                              $cookies.put('email', $scope.email);
                              $cookies.put('password', $scope.password);
                              $cookies.put('keepme', true);
                           }
                        }  
                    }
                });            
         }
      }

      //login with facebook
      $scope.LoginwithFb = function(){

      }

       //login with google plus
      $scope.loginwithGG = function(){


      }

   });

   // directive validate email
   app.directive('myEmail', ['$http', '$timeout', function($http, $timeout) {
      return {
         //restrict: 'A',
        // scope: true,
         require: 'ngModel',
         link: function(scope, element, attr, mCtrl) {
         
            function myValidation(value) {
               var evalidate = /^(?:[a-zA-Z0-9-_])+(?:\.[a-zA-Z0-9-_]+)*@(?:[a-zA-Z0-9-_]+\.){1,2}[a-zA-Z0-9-_]+$/;  
               if(value.length < 1){
                  scope.emailerror = "Địa chỉ email bắt buộc.";

               }else{
                  if(!evalidate.test(value)){
                     scope.emailerror = "Địa chỉ email không đúng dịnh dạng.";
                  }else{
                     scope.emailerror = ""
                     // $timeout(function(){

                     //    $http({
                     //       method: 'POST',
                     //       url: 'https://app-chat-nodejs.herokuapp.com/user/log',
                     //       headers: {
                     //          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                     //       },
                     //       data: { email: value}
                     //    }).then(function(response) {
                     //       //First function handles success
                     //    //   scope.content = response.data;
                     //       scope.emailerror = "Địa chỉ email đã tồn tại.";
                     //    }, function(response) {
                     //       //Second function handles error
                     //     //  scope.content = "Something went wrong";
                     //       scope.emailerror = "Địa chỉ email đã tồn tại.";
                     //    });

                     // }, 1000);
                  }
               }
               return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
         }
      };
   }]);

   //directive validate password
   app.directive('myPassword', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {

            function myValidation(value) {

           //     var strongp = /(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9]+)(?=.*[!@#$%^&~*?^]+)(?=.{15,})/
           //     var mediump = /(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9]+)(?=.*[!@#$%^&~*?^]+)(?=.{10,})/
           //     var weakp = /(?=.*[a-z]+)(?=.*[0-9]+)(?=.{6,})/
                  var plength = /(?=.{8,})/
                  var pvalidate = /(?=.*[a-z])(?=.*[0-9])/

               if (!plength.test(value)) {
                  //   scope.myvalidate = function(){
                        scope.passworderror = "Mật khẩu có ít nhất 6 kí tự."
                 //    }
               }else{
                  if(!pvalidate.test(value)){
                     scope.passworderror = "Mật khẩu phải có kí tự số và chữ."
                  }else{
                     scope.passworderror = ""
                  }
               }
                return value;//dùng trong scope ở controller
            }

            mCtrl.$parsers.push(myValidation);
        }
      };
   });