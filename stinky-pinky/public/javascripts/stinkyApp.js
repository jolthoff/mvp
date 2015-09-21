

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
			}).
			state('signup', {
				url: '/signup',
				templateUrl: '/signup.html',
				controller: 'SignUpController'
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
	
	$scope.login = function(username, password) {

		console.log('username is ' + username + ' ' + 'password is ' + password)

		Auth.login({ username: username, password: password });
	}

}]);

app.controller('SignUpController', ['$scope', 'Auth', function($scope, Auth) {

	$scope.signup = function(username, password) {

		console.log('signup username is ' + username + ' ' + 'signup password is ' + password)

		Auth.signin({ username: username, password: password });
	}

}]);

app.factory('Auth', ['$http', function($http) {

	var authorize = {

		login: function(object) {
			return $http.post('/login', object).then(function(data) {
				console.log(data);
			}, function(error) {
				console.log(error);
			});

		},

		signup: function(object) {
			return $http.post('/signup', object).then(function(data) {
				console.log(data);
			}, function(error) {
				console.log(error);
			});

		}
	}

	return authorize;

}]);