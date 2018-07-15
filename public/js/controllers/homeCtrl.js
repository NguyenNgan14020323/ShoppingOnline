
app.controller('homeCtrl',['$scope','$rootScope', '$cookies',
   function ($scope, $rootScope, $cookies){
    	$scope.tagline = 'To the moon and back!'; 

    //	console.log($scope.get($scope.bracket))  

    	$scope.addToBracket = function(id){
    		 $rootScope.bracket++;
    	}
   }
]);