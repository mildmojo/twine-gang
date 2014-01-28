twine-gang
==========

Server and client for cross-browser, cross-device Twine game control and synchronization.

Add your Twine `index.html` to the project root, then start the server with
`node tg_server.js`. Then visit `http://localhost:3000`. The URL to "join" that play
session will be printed to the console (in the form
`http://localhost:3000/?room_name=867-5309`).

Make sure your Twine HTML file loads `/socket.io/socket.io.js`, 
`/client/microevent.js`, `/client/tg_client.js`, `/client/twine_bindings.js` (in that
order, after jQuery). You may add additional scripts and assets in the `assets/`
directory.

In your Twine story, at a minimum, you'll need to add a macro like:

```javascript
// Broadcast arrival at a new passage to other clients.
prerender.twineGang = function(div) {
  if (typeof TwineGang !== 'undefined' && TwineGang) {
    var passageName = this.title;
    TwineGang.arrive(passageName);
  }
};
```
