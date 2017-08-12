const express = require('express'),
	  app = express(),
	  http = require('http').Server(app),
	  io = require('socket.io')(http),
	  port = process.env.PORT || 3000,

	  matches = [];

app.get('/', (request, response) => response.sendFile(__dirname + '/public/game.html'));
app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
	const match = `${matches.find(match => Object.keys(io.sockets.adapter.rooms[match].sockets).length < 2) || matches.slice(matches.push(`match_${matches.length}`) - 1).pop()}`;
//	console.log(match);

//	console.log(`${socket.id} connected`);
	
	socket.join(match);
//	console.log(Object.keys(io.sockets.adapter.rooms[match].sockets).length);
	io.to(socket.id).in(match).emit('arena', 'arena');
	
	socket.on('disconnect', () => matches.forEach((element, index) => {
		if (element === match) return matches.splice(index, 1)
	}));
});

http.listen(port, () => console.log(`listening on localhost:${port}`));