'use strict';


 app.factory("AuthenticationService",['$location', '$cookies', function($location, $cookies) {
    	return {
	        permit: function(){
	            if($cookies.get('id')){
	            	return true;
	            }else{
	            	$location.path('/')
	            	return false;
	            }
	        }
    };
 }]);


app.config(['$stateProvider', '$urlRouterProvider','$locationProvider','$qProvider', 'slickCarouselConfig',
	function($stateProvider, $urlRouterProvider, $locationProvider, $qProvider, slickCarouselConfig) {
	
      $qProvider.errorOnUnhandledRejections(false);

		// For unmatched routes
		$urlRouterProvider.otherwise('');

		// Application routes
		$stateProvider
			//Home page
			.state('home', {
				url: '',
				controller: 'homeCtrl',
				templateUrl: 'views/home.html'
			})
			//Show detail of product
			.state('productDetail', {
				url: '/productDetail/:product_id',
				controller: 'productDetailCtrl',
				templateUrl: 'views/productDetail.html'
			})
			//Signup
			.state('signup', {
				url: '/signup',
				controller: 'signupCtrl',
				templateUrl: 'views/signup.html'
			})
			//List all catalog
			.state('productCatalog', {
				url: '/productCatalog/:catalog_id',
				controller: 'productCatalogCtrl',
				templateUrl: 'views/productCatalog.html'
			})
			.state('back', {
				url: '/home',
				controller: 'homeCtrl',
				templateUrl: 'views/home.html'
			})
			.state('cart', {
				url: '/cart',
				controller: 'cartCtrl',
				templateUrl: 'views/cart.html'
			})
			.state('payment', {
				url: '/payment',
				controller: 'paymentCtrl',
				templateUrl: 'views/payment.html',
				resolve: {
			        "check" : function(AuthenticationService){   
			            if(!AuthenticationService.permit()){ 
			                alert("You don't have access here.Please login.");
			            }
	        		}
    			}
			})
			.state('search', {
				url: '/searchProduct/:key',
				controller: 'searchProductCtrl',
				templateUrl: 'views/search.html'
			})
			.state('profile', {
				url: '/profile/:user_id',
				controller: 'profileCtrl',
				templateUrl: 'views/profile.html',
				resolve: {
			        "check" : function(AuthenticationService){   
			            if(!AuthenticationService.permit()){ 
			                alert("You don't have access here.Please login.");
			            }
	        		}
    			}
			})
			.state('orderManager', {
				url: '/orderManager/:user_id',
				controller: 'orderManagerCtrl',
				templateUrl: 'views/orderManager.html'
			})
			
		$locationProvider.hashPrefix('');

	    slickCarouselConfig.dots = true;
        slickCarouselConfig.autoplay = true;
	}
]);
