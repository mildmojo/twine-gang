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
    jQuery("a[id='" + id + "']").trigger('click');
  });

  jQuery(function() {
    jQuery('#passages').on('click', function(e) {
      var internalLink = jQuery(e.target).closest('a.internalLink');
      if (internalLink.length > 0) {
        TwineGang.click(internalLink[0].getAttribute('id'));
      }
      return true;
    });
  });
})();
