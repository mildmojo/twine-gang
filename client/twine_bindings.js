(function() {
  if (location.search.match(/\?room=/)) {
    var joinRoom = location.search.substr(1).split('room=').pop();
    TwineGang.bind('connect', function() {
      TwineGang.join(joinRoom, function(success) {
        console.log('Joining ' + joinRoom + ': ' + (success ? 'success' : 'failed'));
      });
    });
  }

  TwineGang.bind('click', function(id) {
    jQuery("a[id='" + id + "']").trigger('unity_actions');
  });

  TwineGang.bind('arrive', function(id) {
    if (state.history[0].passage.title !== id) {
      state.display(id);
    }
  });

})();
