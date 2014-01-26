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
  switchRooms(socket, roomName);

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
    // Servers can't switch and new room has to exist.
    if (!(newRoom in rooms)) {
      if (typeof callback === 'function') {
        callback(false);
      }
      return;
    }

    switchRooms(socket, newRoom, roomName);
    roomName = newRoom;
    callback(true);
  });

  socket.on('disconnect', function() {
    rooms[roomName]--;
  });
});

function createRoomName() {
  // return '5';
  return faker.PhoneNumber.phoneNumberFormat(6).replace(/\d-\d{3}-/, '');
}

function switchRooms(socket, roomName, oldRoom) {
  if (oldRoom) {
    socket.leave(oldRoom);
    rooms[oldRoom]--;
  }

  if (rooms[roomName]) {
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

  socket.emit('id', roomName);
}

server.listen(3000);
