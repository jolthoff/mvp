module.exports = function (io) { 
	io.on('connection', function (socket) {
		console.log("user connected again!");

		// io.on('sending', function(thing) {
		// 	console.log("what if i am called?");
		// 	console.log("thing is " + thing)
		// });
	});

	io.on('echo', function (data) {
		console.log("echo echo");
    	io.emit('echo', data);
	});

};