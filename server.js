const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const matches = [];

app.get('/', (request, response) => response.sendFile(__dirname + '/public/game.html'));

app.use(express.static(__dirname + '/public'));
io.on('connection', socket => {
	'use strict';

	const match = `${matches.find(match => Object.keys(io.sockets.adapter.rooms[match].sockets).length < 2) || matches.slice(matches.push(`match_${matches.length}`) - 1).pop()}`;

	const Arena = function (arena) {
		switch (arena) {
			case 'teste': 
				return new Arena({
					src: '/assets/arenas/teste/'
				});
			break;
			default:
				this.src = arena.src;
			break;
		}
	};

	socket.join(match);
	io.to(socket.id).in(match).emit('arena', Arena('teste'));

	console.log(socket.id);
	console.log(match);

	socket.on('explode', function (center) {
		io.to(match).emit('explode', center);
	});

	socket.on('disconnect', () => matches.forEach((element, index) => {
		if (element === match) return matches.splice(index, 1);
	}));
});

http.listen(port, () => console.log(`listening on localhost:${port}`));