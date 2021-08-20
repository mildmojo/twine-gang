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

## Usage (for any version of Twine)

### Set Up the Server

1. Clone or download this repo (see the "Code" button at the top right of the GitHub project page).
2. At the command line, in your local copy of the project, run `npm install` to install dependencies.
3. Build your Twine story to `index.html` in this project's root next to `tg_server.js`.
4. Start the server with `node tg_server.js`.
5. Visit `http://localhost:3000`. Your story should appear. If you've already followed the steps
   below to integrate your story with TwineGang, your story will request a room from the server
   in the background, and print a link to join that room to the browser's javascript console
   (in the form `http://localhost:3000/?room_name=867-5309`).

### Edit Your Exported Story

Make sure your exported Twine HTML file loads the libraries TwineGang needs (after jQuery):

```html
<script type="text/javascript" src="/socket.io/socket.io.js"></script>
<script type="text/javascript" src="/client/microevent.js"></script>
<script type="text/javascript" src="/client/tg_client.js"></script>
```

If you add more scripts and assets to the `assets/` directory, the TwineGang web server will serve those files at `/assets/<file>`.

### Twine v1 Additional Steps

1. Add the Twine 1 client bindings to your Twine HTML file after the other TwineGang scripts you've included.

```html
<script type="text/javascript" src="/client/twine_bindings.js"></script>

```

2. In your Twine story, add a passage tagged `script`, and paste the contents of [`story_bindings/twine-v1-script-passage.js`](/story_bindings/twine-v1-script-passage.js).

### Twine v2 Additional Steps

**NOTE:** Twine 2 has several "story formats", and not all of them provide scripting hooks, so not all of them can be used with TwineGang. I recommend Sugarcube.

1. Find the file for your Twine version and story format in this repo's [`story_bindings`](/story_bindings) folder (e.g. `twine-v2-sugarcube-story-javascript.js`).
2. In your Twine story, open the Story Javascript window and paste the contents of that file.

If there isn't a binding for the story format you use, and you'd like to write one, please feel free to send a pull request!

### About events

When each passage is rendered, the integration code described above will tell the server. The server will tel all the clients in the same "room" on the server to visit that passage.

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

## Deploying to Glitch

TBD

## Future

- Add a generic message passing function and corresponding Twine macro for
  custom events.
- Support synchronizing more game state, like variables.

## Thanks

Thanks to Jerome Etienne for the [MicroEvent](https://github.com/jeromeetienne/microevent.js)
library.
