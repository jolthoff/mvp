var app = angular.module('stinkyPinky', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'WelcomeController'
			}).
			state('login', {
				url: '/login',
				templateUrl: '/login.html',
				controller: 'LoginController'
			});

		$urlRouterProvider.otherwise('home');

}]);

app.controller('WelcomeController', ['$scope', 'Auth', function($scope, Auth) {
	$scope.welcome = "Welcome to Stinky Pinky!";
	$scope.rules = "When you begin the game, we will give you a clue and you give us a rhyming word pair where the first word relates to the first we give you and the second word relates to the second word we give you!";

	$scope.login = function() {
		Auth.redirectToLogin();
	}
}]);

app.controller('LoginController', ['$scope', 'Auth', function($scope, Auth) {
	var username = $scope.username;
	var password = $scope.password;
	$scope.login = function(username, password) {
		Auth.login($scope.username, $scope.password);
	}

}])

app.factory('Auth', ['$http', function($http) {

	var authorize = {
		redirectToLogin: function() {

			return $http.get('/login').then(function(res) {
				return res.data;
			});

		},

		login: function(username, password) {
			console.log(username);
			console.log(password);

		},

		signup: function() {


		}
	}

	return authorize;

}]);