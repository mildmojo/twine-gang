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
    });

    socket.on('new_passage', function(passageName) {
      self.trigger('new_passage', passageName);
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

  TGClient.prototype.visit = function(passageName) {
    this._socket.emit('new_passage', passageName);
  }

  MicroEvent.mixin(TGClient);

  window.TwineGang = new TGClient();
})();
