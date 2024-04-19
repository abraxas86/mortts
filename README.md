# MorTTS

Ever play Unholy Trinity and wish you could have that "MORTIS" style TTS in your twitch chat?  This is what you need!


## Setup:

1. Rename `botconfig_TEMPLATE.json` to `botconfig.json`
2. Edit `botconfig.json` with your info:
    - Username: username of the puppet account
    - serverAddress: the IP or URL of your webserver (http and socket use the same address & port)
    - serverPort: the port for your server (http and socket use the same address & port)
    - channels: Array of the channels that your bot will listen in on
    - client_id: The ClientID for your puppet account*
    - client_secret: The Client Secret for your puppet account*
    - access_token: The Access Token for your puppet account*
    - refresh_token: The Refresh Token for your puppet account*
  
* Check out this page for info on how to obtain: https://twurple.js.org/docs/examples/chat/basic-bot.html

3. Run `npm install` to grab the packages yo uneed
4. Initiate script via `node mortts-server.js
5. Point a browser source to the same IP address and Port.  You may need to "Interact" with this layer to allow the sound to work
6. Kill the script with ctrl+c


   *Note: This has only been tested locally on a Linux computer.  YMMV
