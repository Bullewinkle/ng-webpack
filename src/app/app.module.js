// Styles
require('app/app.module.styl');

// Application
angular
	.module('app', [
		'ngTouch',
		'ngAnimate',
		'ngSanitize',
		'ngResource',
		'ui.router',
	])
	.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/');
		$locationProvider.html5Mode({
			requireBase: false,
			enabled: true
		});
		$stateProvider.state('home', {
			url: '/',
			views: {
				'body@': {
					template: require('app/home.jade')
				}
			}
		});
	})
	.run(function () {
		console.log('[env]:', ENV);
	})
	.controller('app.ctrl', function () {
		console.log('[app]', 'ready');
	})