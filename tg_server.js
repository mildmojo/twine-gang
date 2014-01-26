var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var faker = require('Faker');

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

  socket.on('new_passage', function(passageName) {
    socket.broadcast.to(roomName).emit('new_passage', passageName);
  });

  socket.on('switch_rooms', function(newRoom, callback) {
    // Servers can't switch and new room has to exist.
    if (socket.get('isServer') || !(newRoom in rooms)) {
      return callback(false);
    }

    switchRooms(socket, newRoom, roomName);
    roomName = newRoom;
    callback(true);
  });
});

function createRoomName() {
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
    socket.set('isServer', false);
  } else {
    // Join as server
    socket.join(roomName);
    rooms[roomName] = 1;
    socket.set('isServer', true);
  }

  socket.emit('id', roomName);
}

server.listen(3000);
