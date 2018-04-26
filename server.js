'use strict';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const mongoose= require('mongoose');
const UserSchema = mongoose.Schema({
	'name': String,
	'pass': String
});
const User = mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost:27017/asmtfy');

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({
	'extended': true
}));
app.use(require('cookie-parser')());
app.route('/')
.get(function (request, response) {
	return response.sendFile(__dirname + '/public/html/menu.html');
})

app.route('/game')
.get(function (request, response) {
	User.findOne({
		'name': request.cookies.name,
		'pass': request.cookies.pass
	}, 'name pass', function (error, user) {
		if (error) return console.log(error);
		if (!(user && user.name && user.pass)) return response.send('<script>window.location.assign("/")</script>}');
		return response.sendFile(__dirname + '/public/html/game.html');
	});
});

io.on('connection', function (socket) {
	var arena;
	socket.on('cookies', function(cookies){
		var request = {};
		request.cookies = cookies
	
		switch (request.cookies.arena) {
			case 'flat':
				arena = {
					'name': 'flat',
					'layers': 1,
					'prob': 0,
					'fx': 0,
					'fy': 0,
					'amax': 0,
					'amin': 0
				} 
				break;
			case 'wall':
				arena = {
					'name': 'wall',
					'layers': 1,
					'prob': 0,
					'fx': 0,
					'fy': 0,
					'amax': 0,
					'amin': 0
				}
				break;
		}
		socket.emit('arena', arena);
		var me;
		switch (request.cookies.char) {
			case 'red':
				me = {
					x: 0,
					w: 0.035,
					name: 'red',
					idle: 6,
					fall: 1,
					jump: 1,
					run: 8,
					speed: 0.04,
					charge: 3,
					attack: 3,
					tiro: 3
				}
			break;
			case 'yellow':
				me = {
					x: 0.8,
					w: 0.025,
					name: 'yellow',
					idle: 5,
					fall: 1,
					jump: 1,
					run: 8,
					speed: 0.04,
					charge: 4,
					attack: 3,
					tiro: 3
				}
			break;
		}
		socket.emit('me', me);
	});

	console.log(`${socket.id} just connected`);

	socket.on('disconnect', function () {
		console.log(`${socket.id} just disconnected`);
//			matches.forEach(function (element, index) {
//				if (element === match) matches.splice(index, 1);
//			});
	});
});

app.route('/login')
.post(function (request, response) {
	return User.findOne({
		'name': request.body.name,
		'pass': request.body.pass
	}, 'name pass', function (error, user) {
		if (error) return console.log(error);
		if (user && user.name && user.pass) {
			response.cookie('name', user.name);
			response.cookie('pass', user.pass);
			return response.send('1');
		}
		response.cookie('name', undefined);
		response.cookie('pass', undefined);
		response.send('0');
	});
});

app.route('/signin')
.post(function (request, response) {
	if (User.findOne({
		'name': request.body.name
	}, 'name', function (error, user) {
		if (error) return console.log(error);
		if (user && user.name) {
			response.cookie('name', undefined);
			response.cookie('pass', undefined);
			response.send('0');
			return false;
		}

		User({
			'name': request.body.name,
			'pass': request.body.pass
		}).save(function (error, user) {
			if (error) return console.log(error);
			response.cookie('name', user.name);
			response.cookie('pass', user.pass);
			return response.send('1');
		});
	}));
});

http.listen(port, () => console.log('listening on localhost: ' + port));