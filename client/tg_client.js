(function(){
  var TGClient = function(host) {
    var self = this;
    endpoint = host ||
               (location.protocol + '//' + location.hostname +
                   (location.port ? ':' + location.port : ''));
    endpoint = endpoint + '/rooms';
    var socket = io.connect(endpoint);
    this.roomName = '';

    socket.on('connect', function(){
      self.trigger('connect');
    });

    socket.on('id', function(room) {
      self.roomName = room;
      self.trigger('new_room', room);
      console.log('new room: ' + room);
    });

    socket.on('click', function(id) {
      self.trigger('click', id);
      console.log('click: ' + id);
    });

    socket.on('arrive', function(id) {
      self.trigger('arrive', id);
      console.log('arrive: ' + id);
    });

    this._socket = socket;
  };

  TGClient.prototype.join = function(room, callback) {
    this._socket.emit('join', room, function(result) {
      if (!result) {
        console.error('Failed to join room: ' + room);
      }
      if (typeof callback === 'function') {
        callback(result);
      }
    });
  };

  TGClient.prototype.click = function(id) {
    this._socket.emit('click', id);
    console.log('emitted click');
  };

  TGClient.prototype.arrive = function(id) {
    this._socket.emit('arrive', id);
    console.log('emitted arrive', id);
  };

  MicroEvent.mixin(TGClient);

  window.TwineGang = new TGClient();
  console.log('WORKIN ON A TWINE GANG');
})();
