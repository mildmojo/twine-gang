TwineGang
==========

TwineGang is a server and client for cross-browser, cross-device Twine game
control and synchronization. When two or more Twine games are synchronized,
taking a link to a new passage in any of them will advance all other games to
the same place. Plays nice with [Heroku](https://heroku.com) app hosting.

Originally developed for use in the Global Game Jam 2014 entry, "Get a Clue"
([play](http://get-a-clue.herokuapp.com),
[source](https://github.com/benjamingold/GGJ14GetAClue/)).

## Use Cases

- Demonstrate a game on a projector while controlling it with your phone.
- Hand a synchronized tablet to an audience member to allow them to play publicly.
- Play a Twine game collaboratively with a friend.
- Tear-off UI: add a QR code with the room URL to your Start passage. When
  another client joins, stop displaying passage text in the first browser and
  instead display full-screen images/video/Flash/Unity.

## Requirements

- Hosting platform that supports websockets (like Heroku or Nodejitsu)
- Browser with [websocket support](http://caniuse.com/#agents=desktop,ios_saf,op_mini,android,bb,and_chr,and_ff,ie_mob)

## Usage

1. Install node modules with `npm install`.
2. Build your Twine story to `index.html` in this project's root next to `tg_server.js`.
3. Start the server with `node tg_server.js`.
4. Visit `http://localhost:3000`. The URL to "join" that play session will be
   printed to the console (in the form `http://localhost:3000/?room_name=867-5309`).

Make sure your Twine HTML file loads the libraries TwineGang needs (after jQuery):

```html
<script type="text/javascript" src="/socket.io/socket.io.js"></script>
<script type="text/javascript" src="/client/microevent.js"></script>
<script type="text/javascript" src="/client/tg_client.js"></script>
<script type="text/javascript" src="/client/twine_bindings.js"></script>
```

You may add additional scripts and assets in the `assets/` directory.

In your Twine story, at a minimum, you'll need to add a passage tagged 'script':

```javascript
// requires jQuery
// ^^^ makes sure jQuery is included on the page. If you've enabled jQuery in
//   your StorySettings passage, you may remove this line.

// Broadcast arrival at a new passage to other clients.
prerender.twineGang = function(div) {
  if (typeof TwineGang !== 'undefined' && TwineGang) {
    var passageName = this.title;
    TwineGang.arrive(passageName);
  }
};
```

When each passage is rendered, this code will tell the server. The server will
tell all the clients in the same "room" on the server to visit that passage.

You may attach your own event handlers to TwineGang events with `TwineGang.bind`:

```javascript
TwineGang.bind('clientCount', function(count) {
  $('#player-count').text(count);
});
```

See [tg_client.js](/client/tg_client.js) for available events.

## Deploying to Heroku

1. Install [Heroku Toolbelt](https://toolbelt.heroku.com/).
2. `heroku auth:login`
3. `heroku apps:create <appname>`
4. `heroku git:clone <appname> && cd <appname>`
5. `heroku labs:enable websockets`
6. Copy your prepared Twine index.html (see Usage) to the newly-cloned app
   repository folder.
7. `git add index.html && git commit -m 'Adds my story.'`
8. `git push heroku master`
9. Visit `http://<appname>.herokuapp.com`.

## Future

- Add a generic message passing function and corresponding Twine macro for
  custom events.
- Support synchronizing more game state, like variables.

## Thanks

Thanks to Jerome Etienne for the [MicroEvent](https://github.com/jeromeetienne/microevent.js)
library.
