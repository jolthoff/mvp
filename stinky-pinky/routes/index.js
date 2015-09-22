var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Stinky Pinky' });
});

var mongoose = require('mongoose');

var User = mongoose.model('User');

router.post('/login', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne( {username: username }, function(err, user) {
		if (err) { console.log(err) }
		else if (!user) {
			//does redirect work?
			res.redirect('#/login');
		} else {
			bcrypt.compare(password, user.password, function(err, isMatch) {
				if (isMatch) {
					//until we have a game condition redirect back home
					window.localStorage.setItem('username', username);
					res.json(user);
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
					if (err) {console.log (err) }

					console.log("new user made");
					// redirect to home until game condition is made
					res.redirect('/');
				})
			}
	})
})

module.exports = router;
