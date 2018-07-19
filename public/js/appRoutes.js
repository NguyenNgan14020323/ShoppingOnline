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
			.state('productDetail', {
				url: '/productDetail/:product_id',
				controller: 'productDetailCtrl',
				templateUrl: 'views/productDetail.html'
			})
			.state('signup', {
				url: '/signup',
				controller: 'signupCtrl',
				templateUrl: 'views/signup.html'
			})
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
			
		$locationProvider.hashPrefix('');
	}
]);
