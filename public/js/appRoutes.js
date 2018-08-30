'use strict';

app.config(['$stateProvider', '$urlRouterProvider','$locationProvider','$qProvider', 'slickCarouselConfig',
	function($stateProvider, $urlRouterProvider, $locationProvider, $qProvider, slickCarouselConfig) {
	
        $qProvider.errorOnUnhandledRejections(false);

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
			.state('cart', {
				url: '/cart',
				controller: 'cartCtrl',
				templateUrl: 'views/cart.html'
			})
			.state('payment', {
				url: '/payment',
				controller: 'paymentCtrl',
				templateUrl: 'views/payment.html'
			})
			.state('search', {
				url: '/searchProduct/:key',
				controller: 'searchProductCtrl',
				templateUrl: 'views/search.html'
			})
			.state('profile', {
				url: '/profile/:user_id',
				controller: 'profileCtrl',
				templateUrl: 'views/profile.html'
			})
			
		$locationProvider.hashPrefix('');

	    slickCarouselConfig.dots = true;
        slickCarouselConfig.autoplay = true;
	}
]);
