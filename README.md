twine-gang
==========

Server and client for cross-browser, cross-device Twine game control and synchronization.

Add your Twine `index.html` to the project root, then start the server with
`node tg_server.js`. Then visit `http://localhost:3000`.

Make sure your Twine HTML file loads `/socket.io/socket.io.js`, 
`/client/tg_client.js`, and `/client/twine_bindings.js`. You may add additional
scripts and assets in the `assets/` directory.
