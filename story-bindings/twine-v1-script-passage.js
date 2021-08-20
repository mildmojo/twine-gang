// requires jQuery
// ^^^ makes sure jQuery is included on the page. If you've enabled jQuery in
//   your StorySettings passage, you may remove this line.

/***
 *
 *  Place everything in this file in a new Twine passage tagged `script`.
 *
 ***/

// Broadcast arrival at a new passage to other clients.
prerender.twineGang = function(div) {
  if (typeof TwineGang !== 'undefined' && TwineGang) {
    var passageName = this.title;
    TwineGang.arrive(passageName);
  }
};
