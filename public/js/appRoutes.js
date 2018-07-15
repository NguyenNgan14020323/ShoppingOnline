'use strict';

app.config(['$stateProvider', '$urlRouterProvider','$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {

		// For unmatched routes
		$urlRouterProvider.otherwise('');

		// Application routes
		$stateProvider
			.state('home', {
				url: '',
				controller: 'homeCtrl',
				templateUrl: 'views/home.html'
			})
			.state('product', {
				url: '/product',
				controller: 'productCtrl',
				templateUrl: 'views/product.html'
			})
			.state('signup', {
				url: '/signup',
				controller: 'signupCtrl',
				templateUrl: 'views/signup.html'
			})
		$locationProvider.hashPrefix('');
	}
]);
