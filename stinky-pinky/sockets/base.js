module.exports = function (io) { 
	io.on('connection', function (socket) {
		console.log("user connected again!");
		socket.on('updateTime', function(data) {
			io.emit('updateTime', data);
		});

		socket.on('updateRiddle', function(data) {
			io.emit('updateRiddle', data);
			console.log("current riddle is " + JSON.stringify(data));
		});

		socket.on('updatePoints', function(data) {
			io.emit('updatePoints', data);

			console.log("points are " + data)
		})
	});

};