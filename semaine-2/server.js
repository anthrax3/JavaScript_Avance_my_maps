var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var md5 = require('MD5');

app.use('/public', express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

var users = {};
var messages = [];
var history = 6;

io.on('connection', function(socket){
	var me = false;

	socket.on('sendMessage', function(message){
		message.user = me;
		date = new Date();
		message.h = date.getHours();
		message.m = date.getMinutes();
        messages.push(message);
        if(messages.length > history){
            messages.shift();
        }
		io.emit('recevMessage', message);
	});

	socket.on('login', function(user){
        hrTime = process.hrtime()
		me = user;
		me.id = parseInt(hrTime[0] * 1000000 + hrTime[1] / 1000);
		me.avatar = 'https://gravatar.com/avatar/' + md5(user.mail) + '?s=50';
		socket.emit('logged', me);
		users[me.id] = me;
		socket.broadcast.emit('newUser', user);

		for (var k in users){
			socket.emit('newUser', users[k]);
		}

        for (var k in messages){
            socket.emit('recevMessage', messages[k]);
        }
	});

	socket.on('disconnect', function(){
		if(!me){
			return false;
		}
		delete users[me.id];
		console.log('logout', me);
		io.emit('logout', me);
	});

    socket.on('sendLocation', function(data){
        users[me.id].lat = data.lat;
        users[me.id].lng = data.lng;
        socket.broadcast.emit("updateLocation", users[me.id]);
    });

    socket.on("requestLocations", function(sendData) {
        sendData(users);
    });
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});
