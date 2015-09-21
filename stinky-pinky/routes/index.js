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
	console.log(req);
	var user = new User(req.body);

	user.save(function(err, user) {
		if(err) { return next(err);}

		res.json(user);
	});
})

module.exports = router;
