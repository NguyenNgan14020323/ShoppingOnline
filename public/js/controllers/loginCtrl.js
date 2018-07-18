 // //controller
   app.controller('loginCtrl', function($scope, $rootScope, $cookies, $window, Data){
      //login general
    $scope.logout = function(){
        $rootScope.showLogin = true;
        var host = $window.location.host;
        var landingUrl = "http://" + host + "/";
        $window.location.href = landingUrl;
        window.location.reload();
    }
    
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

                Data.post('login', 1, user).then(function (result) {
                    if(result.status == 'error'){
                       alert(result.message)
                    }else{
                        if (!result){
                            alert('login faild');
                        } else {
                           $scope.showLogin = false;
                           $rootScope.username = result.name;
                           var temp = result.name;
                           temp = temp.substr(0, 1);
                           temp = temp.toUpperCase();
                           $rootScope.avatar = temp

                           $window.sessionStorage.setItem("token", result.token);

                           if($scope.keepme != undefined){
                              //let cookie alive 7 days
                              $cookies.put('id', result.id, {'expires': (new Date().getTime()+24*3600*1000*7).toString(),
                                                            'secure ': true})
                              $cookies.put('keepme', true, {'expires' :  (new Date().getTime()+24*3600*1000*7).toString(),
                                                            'secure ': true});

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

      //log out
      $scope.logout = function(){
        
        Data.post('logout', 1, {logout: true}).then(function (result) {
            $cookies.remove('id')
            $cookies.remove('keepme')
            $window.location.reload();
        });   
      }

   });

   // directive validate email
   app.directive('myEmail', ['$http', '$timeout', 'Data', function($http, $timeout, Data) {
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
                     $timeout(function(){
                        Data.post('checkUser', 1, { email: value }).then(function (result) {
                           if(!result.error){
                              scope.emailerror = result.message
                           }else
                              scope.emailerror = ""
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

   //directive validate password
   app.directive('myPassword', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {

            function myValidation(value) {

           //     var strongp = /(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9]+)(?=.*[!@#$%^&~*?^]+)(?=.{15,})/
           //     var mediump = /(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9]+)(?=.*[!@#$%^&~*?^]+)(?=.{10,})/
           //     var weakp = /(?=.*[a-z]+)(?=.*[0-9]+)(?=.{6,})/
                  var plength = /(?=.{6,})/
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