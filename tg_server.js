var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var faker = require('Faker');
io.set('log level', 1);

// Room name => client count
var rooms = {};

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/client', express.static(__dirname + '/client'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.of('/rooms').on('connection', function(socket) {
  var roomName = createRoomName();
  joinRoom(socket, roomName);

  socket.on('click', function(id) {
    socket.broadcast.to(roomName).emit('click', id);
  });

  // Sometimes passage arrivals might be driven by code.
  // Broadcast server passage arrivals to keep clients in line.
  socket.on('arrive', function(id) {
    if (socket.isServer) {
      socket.broadcast.to(roomName).emit('arrive', id);
    }
  });

  socket.on('join', function(newRoom, callback) {
    callback = callback || function(){};

    // New room has to exist.
    if (!(newRoom in rooms)) {
      callback(false);
      return;
    }

    switchRooms(socket, roomName, newRoom);
    roomName = newRoom;
    callback(true);
  });

  socket.on('disconnect', function() {
    leaveRoom(socket, roomName);
  });
});

// Build a room number like '867-5309'
function createRoomName() {
  return faker.PhoneNumber.phoneNumberFormat(6).split('-').splice(2).join('-');
}

function switchRooms(socket, oldRoom, newRoom) {
  leaveRoom(socket, oldRoom);
  joinRoom(socket, newRoom);
}

function leaveRoom(socket, roomName) {
  socket.leave(roomName);
  rooms[roomName]--;
  if (rooms[roomName] > 0) {
    io.of('/rooms').in(roomName).emit('clientCount', rooms[roomName]);
  } else {
    delete rooms[roomName];
  }
}

function joinRoom(socket, roomName) {
  if (roomName in rooms && rooms[roomName] > 0) {
    // Join as client
    socket.join(roomName);
    rooms[roomName]++;
    socket.isServer = false;
  } else {
    // Join as server
    socket.join(roomName);
    rooms[roomName] = 1;
    socket.isServer = true;
  }

  socket.emit('newRoom', roomName);
  io.of('/rooms').in(roomName).emit('clientCount', rooms[roomName]);
}

var port = process.env.PORT || 3000;
server.listen(port);

console.log('Listening on port ' + port);
