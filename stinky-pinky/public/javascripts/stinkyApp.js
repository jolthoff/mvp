

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
				controller: 'LobbyController',
				authenticate: true
			}).
			state('game', {
				url: '/game',
				templateUrl: '/game.html',
				controller: 'GameController',
				authenticate: true
			});

		$urlRouterProvider.otherwise('home');

}]);

app.controller('WelcomeController', ['$scope', 'Auth', function($scope, Auth) {
	$scope.welcome = "Welcome to Stinky Pinky!";

	$scope.rules = "When you begin the game, we will give you a clue and you give us a rhyming word pair where the first word relates to the first we give you and the second word relates to the second word we give you!";


}]);

app.controller('LoginController', ['$scope', 'Auth', function($scope, Auth) {
	
	$scope.login = function(username, password) {

		console.log('username is ' + username + ' ' + 'password is ' + password)

		Auth.login({ username: username, password: password }, function(data) {
			$scope.username = '';
			$scope.password = '';
		});
	};

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

		Vet.check({ riddle: riddle, answer: answer }, function(data) {
			console.log(data);
			$scope.riddle = '';
			$scope.answer = '';
		})
	};


}]);

app.controller('GameController', ['$scope','Vet','$timeout', function($scope, Vet, $timeout) {

	//copy of riddle objects in the database stored in the array
	$scope.index = 0;
	$scope.riddles = [];

	//rendered riddle for user to answer
	$scope.currentRiddle;
	$scope.response;
	$scope.time = 60;
	$scope.wrong = false;
	$scope.endgame = false;
	$scope.points = 0;

	$scope.grabAllRiddles = function() {
		Vet.grabAllRiddles(function(data) {
			console.log(data);
			$scope.riddles = angular.copy(data.data);
			//grab and render a riddle
			$scope.getRiddle();
		});
	};
	$scope.decrementTime = function() {
		$scope.time -= 1;
		if ($scope.time <= 0) {
			$scope.gameover();
		}
	};

	$scope.setTimer = function() {
		var timer = setInterval(function() {
			$scope.$apply($scope.decrementTime());
		}, 1000);
	};

	$scope.resetTime = function() {
		$scope.time = 60;
	}

	$scope.checkAnswer = function(response) {
		if (!response) {
			$scope.incorrectAnswer();
		} else if (response.toLowerCase() === $scope.currentRiddle.a.toLowerCase()) {
			$scope.correctAnswer();
		} else {
			$scope.incorrectAnswer();
		}

	};

	$scope.correctAnswer = function() {
		$scope.points += 1;
		$scope.riddles.splice($scope.index, 1);
		$scope.response = '';
		$scope.getRiddle();
		$scope.resetTime();
	};

	$scope.incorrectAnswer = function() {
		// subtract points until animation can be made
		$scope.wrong = true;
		$scope.response = '';
		$scope.decrementTime();
		$timeout(function(passed) {
			$scope.wrong = false;
		}, 600);

	};

	$scope.skipRiddle = function() {
		$scope.points -= 1;
		$scope.riddles.splice($scope.index, 1);
		$scope.getRiddle();
		$scope.resetTime();
	};

	$scope.getRiddle = function() {
		var randomIndex = Math.floor(Math.random() * $scope.riddles.length);
		$scope.index = randomIndex;
		$scope.currentRiddle = $scope.riddles[randomIndex];
	};

	$scope.gameover = function() {
		$scope.endgame = true;
	}

	$scope.grabAllRiddles();
	$scope.setTimer();
}]);

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
		},

		grabAllRiddles: function(cb) {
			return $http.get('/riddles').then(function(data) {
				cb(data);
			}, function(error) {
				console.log(error);
			});
		}
	}

	return check;

}]);