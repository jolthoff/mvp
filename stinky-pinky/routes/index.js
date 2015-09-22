var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var unirest = require('unirest');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Stinky Pinky' });
});

var mongoose = require('mongoose');

var User = mongoose.model('User');
var Riddle = mongoose.model('Riddle');

router.post('/login', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne( {username: username }, function(err, user) {
		if (err) { console.log(err) }
		else if (!user) {
			//does redirect work?
			res.render('/login');
			res.end();
		} else {
			bcrypt.compare(password, user.password, function(err, isMatch) {
				if (isMatch) {
					//until we have a game condition redirect back home
					window.localStorage.setItem('username', username);
					res.render('/lobby.html');
					res.json(user);
					res.send("welcome!");
				} else {
					res.redirect('#/home');
					res.send("Already a user!");
				}
			});
		}
	});


	// var user = new User(req.body);

	// user.save(function(err, user) {
	// 	if(err) { return next(err);}

	// 	res.json(user);
	// });
});

router.post('/signup', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	var cipher = bcrypt.hashSync(password, null, null);

	User.findOne( {username: username }, function(err, user) {
		if (err) { console.log(err) }

		else if (user) {
			console.log("duplicate user");
			res.redirect('/');
		} else {
			User.create( {
				username: username,
				password: cipher
			}, function (err, user) {
				if (err) {console.log(err) }

				console.log("new user made");
				// redirect to home until game condition is made
				res.redirect('/');
			})
		}
	})
});

router.post('/riddles', function(req, res, next) {

	var riddle = req.body.riddle.toLowerCase();
	var answer = req.body.answer.toLowerCase();

	var wordsArray = riddle.split(' ').concat(answer.split(' '));

	if (wordsArray.length !== 4) {
		res.send("no good");
		return;
	}

	var firstWord = wordsArray[0];
	var secondWord = wordsArray[1];
	var thirdWord = wordsArray[2];
	var fourthWord = wordsArray[3];

	

	Riddle.findOne( {r: riddle}, function(err, exists) {
		if (err) { console.log(err) }
		else if (exists) {
			console.log('duplicate riddle');
			res.send("Duplicate riddle");
			return;
		} else {


			var rhymePair = false;
			var firstRelatePair = false;
			var secondRelatePair = false;
			
			

			var thirdWordRhymes;
			// var fourthWordRhymes;
			var firstWordSynonyms;
			var secondWordSynonyms;

			unirest.get("https://wordsapiv1.p.mashape.com/words/" + thirdWord + "/rhymes")
				.header("X-Mashape-Key", "re3jL1GhEGmshZqisjbtjgAx655Yp1F7erajsnVcZtnphNDwZL")
				.header("Accept", "application/json")
				.end(function (result) {

				  thirdWordRhymes = result.body.rhymes.all;


				  if (thirdWordRhymes) {
					  for (var i = 0; i < thirdWordRhymes.length; i++) {
						if (fourthWord === thirdWordRhymes[i]) {
							rhymePair = true;
						}
					  }
				  } else {
				  	res.send("no good");
				  	return;
				  }

				  unirest.get("https://wordsapiv1.p.mashape.com/words/" + firstWord + "/synonyms")
					.header("X-Mashape-Key", "re3jL1GhEGmshZqisjbtjgAx655Yp1F7erajsnVcZtnphNDwZL")
					.header("Accept", "application/json")
					.end(function (result) {
					  // console.log(result.status, result.headers, result.body);
					  firstWordSynonyms = result.body.synonyms;

					  if (firstWordSynonyms) {

						  for (var i = 0; i < firstWordSynonyms.length; i++) {
							if (thirdWord === firstWordSynonyms[i]) {
								firstRelatePair = true;
							}
						  }

					  } else {
					  	res.send("no good");
					  	return;
					  }

					  unirest.get("https://wordsapiv1.p.mashape.com/words/" + secondWord + "/synonyms")
						.header("X-Mashape-Key", "re3jL1GhEGmshZqisjbtjgAx655Yp1F7erajsnVcZtnphNDwZL")
						.header("Accept", "application/json")
						.end(function (result) {
						  // console.log(result.status, result.headers, result.body);
						  secondWordSynonyms = result.body.synonyms;

						  if (secondWordSynonyms) {
							 for (var i = 0; i < secondWordSynonyms.length; i++) {
								if (fourthWord === secondWordSynonyms[i]) {
									secondRelatePair = true;
								}
							  }
						  } else {
						  	res.send("no good");
						  	return;
						  }

						  if (rhymePair && firstRelatePair && secondRelatePair) {
							Riddle.create( {
								r: riddle,
								a: answer
							}, function (err, riddle) {
								if (err) { console.log(err) }
									console.log("new riddle inserted");
									res.send("thank you!");
							});

						  } else {
						  	res.send("no good");
						  	return;
						  }

						});
					});

				});

		}
	})

});

router.get('/riddles', function(req, res, next) {

	Riddle.find(function(err, riddles) {
		if ( err ) { console.log(err) }
		else {
			res.send(riddles);
		}

	})
});

module.exports = router;
