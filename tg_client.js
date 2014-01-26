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

function MicroEvent(){};

MicroEvent.prototype  = {
  bind  : function(event, fct){
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fct);
  },
  unbind  : function(event, fct){
    this._events = this._events || {};
    if( event in this._events === false  )  return;
    this._events[event].splice(this._events[event].indexOf(fct), 1);
  },
  trigger : function(event /* , args... */){
    this._events = this._events || {};
    if( event in this._events === false  )  return;
    for(var i = 0; i < this._events[event].length; i++){
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin  = function(destObject){
  var props = ['bind', 'unbind', 'trigger'];
  for(var i = 0; i < props.length; i ++){
    if( typeof destObject === 'function' ){
      destObject.prototype[props[i]]  = MicroEvent.prototype[props[i]];
    }else{
      destObject[props[i]] = MicroEvent.prototype[props[i]];
    }
  }
}
