var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

var User = mongoose.model('User', UserSchema);

// module.exports = User;