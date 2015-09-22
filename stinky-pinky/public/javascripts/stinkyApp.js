

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
			}).
			state('lobby', {
				url: '/lobby',
				templateUrl: '/lobby.html',
				controller: 'LobbyController'
			}).
			state('game', {
				url: '/game',
				templateUrl: '/game.html',
				controller: 'GameController'
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

		Auth.login({ username: username, password: password }, function(data) {
			$scope.username = '';
			$scope.password = '';
		});
	}

}]);

app.controller('SignUpController', ['$scope', 'Auth', function($scope, Auth) {

	$scope.signup = function(username, password) {

		console.log('signup username is ' + username + ' ' + 'signup password is ' + password)

		Auth.signup({ username: username, password: password }, function(data) {
			$scope.username = '';
			$scope.password = '';
		});
	}

}]);

app.controller('LobbyController', ['$scope', 'Vet', function($scope, Vet) {

	$scope.send = function(riddle, answer) {

		console.log('your riddle is ' + riddle + ' your answer is ' + answer)

		Vet.check({ riddle: riddle, answer: answer }, function(data) {
			console.log(data);
		})
	};


}]);

app.controller('GameController', ['$scope', function($scope) {

	//copy of riddle objects in the database stored in the array
	$scope.index = 0;
	$scope.riddles = [{r: 'Start', a: 'Heart'}];

	//rendered riddle for user to answer
	$scope.currentRiddle;

	$scope.points = 0;

	$scope.answer = function(answer) {
		if (answer.toLowerCase() === $scope.currentRiddle.answer.toLowerCase()) {
			$scope.correctAnswer();
		} else {
			$scope.incorrectAnswer();
		}

	};

	$scope.correctAnswer = function() {
		$scope.points += 1;
		$scope.riddles.splice($scope.index, 1);
		$scope.getRiddle();
	};

	$scope.incorrectAnswer = function() {
		// subtract points until animation can be made

	};

	$scope.skipRiddle = function() {
		$scope.points -= 1;
		$scope.riddles.splice($scope.index, 1);
		$scope.getRiddle();
	};

	$scope.getRiddle = function() {
		var randomIndex = Math.floor(Math.random() * $scope.riddles.length);
		$scope.index = randomIndex;
		$scope.currentRiddle = $scope.riddles[randomIndex];
	};

}])

app.factory('Auth', ['$http', function($http) {

	var authorize = {

		login: function(object, cb) {
			return $http.post('/login', object).then(function(data) {
				console.log(data);
				cb(data);
			}, function(error) {
				console.log(error);
			});

		},

		signup: function(object, cb) {
			return $http.post('/signup', object).then(function(data) {
				console.log(data);
				cb(data);
			}, function(error) {
				console.log(error);
			});

		}
	}

	return authorize;

}]);

app.factory('Vet', ['$http', function($http) {

	var check = {

		check: function(object, cb) {
			return $http.post('/riddles', object).then(function(data) {
				cb(data)
			}, function(error) {
				console.log(error);
			});
		}
	}

	return check;

}])