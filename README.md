> [!IMPORTANT]  
> **UNDER DEVELOPMENT!**  
> This project is under development. Features may change, and some functions may not work as expected.

---

## Installation

```js
npm i github:tyowk/aoi.lavalink#main
```
---

## Setup

The setup is used to initialize the bot client and configure the Lavalink music system. Aoi.js is the main client framework, and Aoi.Lavalink is an integration that allows you to connect to a Lavalink server to stream music.

```js
// const { AoiClient } = require('aoi.js');
const { MusicClient } = require('aoi.lavalink'); // Importing the MusicClient for handling Lavalink integration.

// const client = new AoiClient({ ... });

const voice = new MusicClient(client, {
    nodes: [{
        name: 'my lavalink node',                // A custom name for the Lavalink node (can be any string).
        url: 'someurl.com:0000',                 // URL to your Lavalink node. Replace with your actual Lavalink server URL.
        auth: 'youshallnotpass',                 // Authentication password for the Lavalink node.
        secure: false                            // Set to true if your Lavalink server uses SSL/TLS (HTTPS).
    }],
    maxQueueSize: 100,                           // Maximum number of tracks that can be queued for playback.                       # default is 100
    maxPlaylistSize: 100,                        // Maximum number of tracks that can be in a playlist.                             # default is 100
    searchEngine: 'ytsearch',                    // Default search engine. You can set this to 'ytsearch' or 'scsearch' or others.  # default is ytsearch
    debug: false                                 // Whether to enable debug logs for the music client. default is false.            # default is false
});
```

see [here](https://guide.shoukaku.shipgirl.moe/guides/2-options/) for more client options.

---

## Functions

These are the core music commands and functions available for the bot. 

```bash
SOON™
```

---

## Events

You can listen to various events such as when a track starts, when the player is paused, etc., and respond to them with custom code.

```js
// const voice = new MusicClient(client, { ... });   // Initialize the MusicClient instance with the bot client.

voice.voiceEvent('trackStart', {                     // The event type, e.g., when a track starts playing ('trackStart').
    channel: '$channelId',                           // The ID of the channel where the event will trigger (can be dynamic or static).
    code: `$songInfo[title]`                         // The action to take when the event is triggered. Here it will return the title of the song.
});
```

---

### Event Handler

```js
// const voice = new MusicClient(client, { ... });   // Initialize the MusicClient instance with the bot client.

voice.loadVoiceEvents('./voice/', false);            // Load custom music event handlers from a directory. 'false' disables debug logs.
```

**Example Event File** (in `/voice/trackStart.js`):

```js
module.exports = [{
    channel: '$channelId',    // The ID of the channel where the event will trigger (can be dynamic or static).
    type: 'trackStart',       // The event type, e.g., when a track starts playing ('trackStart').
    code: `$songInfo[title]`  // The action to take when the event is triggered. Here it will return the title of the song.
}]
```

---

> [!note]
> Make sure your events directory is separate from the commands directory. Otherwise, the events will not load.
