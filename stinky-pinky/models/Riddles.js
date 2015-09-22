var mongoose = require('mongoose');

var RiddleSchema = new mongoose.Schema({
	r: String,
	a: String
});

var User = mongoose.model('Riddle', RiddleSchema);
