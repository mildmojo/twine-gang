(function(exports) {
  var Gamepad = window.Gamepad;
  var gamepad = new Gamepad();
  var axes = { LEFT_STICK_X: 0, LEFT_STICK_Y: 0 };

  gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
    console.log('Gamepad connected.');
  });

  gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
    console.log('Gamepad disconnected.');
  });

  gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
    switch(e.control) {
      case 'DPAD_DOWN':
      case 'DPAD_RIGHT':
        nextLink();
        break;
      case 'DPAD_UP':
      case 'DPAD_LEFT':
        prevLink();
        break;
      case 'FACE_1':
      case 'FACE_2':
      case 'FACE_3':
      case 'FACE_4':
        jQuery('a.internalLink.gamepadSelected').click();
        break;
    }
  });

  gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(data) {
    var newValue = 0;
    if (Math.abs(data.value) > 0.5) {
      newValue = data.value < 0 ? -1 : 1;
      if (axes[data.axis] !== newValue) {
        if (data.axis === 'LEFT_STICK_X') {
          if (newValue === -1) {
            gamepad._fire(Gamepad.Event.BUTTON_DOWN, {control: 'DPAD_LEFT'});
          } else {
            gamepad._fire(Gamepad.Event.BUTTON_DOWN, {control: 'DPAD_RIGHT'});
          }
        } else if (data.axis === 'LEFT_STICK_Y') {
          if (newValue === 1) {
            gamepad._fire(Gamepad.Event.BUTTON_DOWN, {control: 'DPAD_DOWN'});
          } else {
            gamepad._fire(Gamepad.Event.BUTTON_DOWN, {control: 'DPAD_UP'});
          }
        }
      }
    }
    axes[data.axis] = newValue;
  });

  gamepad.init();

  function nextLink() {
    var links = jQuery('a.internalLink');
    var newIndex = 0;
    var $first = jQuery(links[0]);
    var $last = jQuery(links[links.length - 1]);
    if (links.is('.gamepadSelected') && ! $last.is('.gamepadSelected')) {
      links.each(function(_idx, el) {
        var $el = jQuery(el);
        if ($el.is('.gamepadSelected')) {
          $el.removeClass('gamepadSelected');
          newIndex = _idx + 1;
        }
      });
    } else if ($last.is('.gamepadSelected')) {
      $last.removeClass('gamepadSelected');
    }
    jQuery(links[newIndex]).addClass('gamepadSelected');
  }

  function prevLink() {
    var links = jQuery('a.internalLink');
    var newIndex = 0;
    var $first = jQuery(links[0]);
    var $last = jQuery(links[links.length - 1]);
    if (links.is('.gamepadSelected')) {
      if ($first.is('.gamepadSelected')) {
        $first.removeClass('gamepadSelected');
        newIndex = links.length - 1;
      } else {
        links.each(function(_idx, el) {
          var $el = jQuery(el);
          if ($el.is('.gamepadSelected')) {
            $el.removeClass('gamepadSelected');
            newIndex = _idx - 1;
          }
        });
      }
    }
    jQuery(links[newIndex]).addClass('gamepadSelected');
  }

})(((typeof(module) !== 'undefined') && module.exports) || window);
