> [!IMPORTANT]  
> **UNDER DEVELOPMENT!**  
> This project is under development. Features may change, and some functions may not work as expected.

---

## Installation

```bash
npm i github:tyowk/aoi.lavalink#main
```
---

## Setup

The setup is used to initialize the bot client and configure the Lavalink music system. Aoi.js is the main client framework, and Aoi.Lavalink is an integration that allows you to connect to a Lavalink server to stream music.

```js
const { AoiClient } = require('aoi.js');
const { MusicClient } = require('aoi.lavalink'); // Importing the MusicClient for handling Lavalink integration.

const client = new AoiClient({ ... });

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

---

## Functions

These are the core music commands and functions available for the bot. 

```bash
$playTrack[query;engine?;debug?]    # Play a track based on a search query or URL. You can specify the engine, like 'youtube', 'soundcloud' or 'spotify'.
$stopTrack                          # Stop the current track and clear the queue.
$disconnect                         # Disconnect the bot from the voice channel.
$connect[voiceId?]                  # Connect the bot to a voice channel by specifying the voice channel ID (optional).
$hasPlayer[guildId?]                # Check if the bot already has a player (is playing music) in the specified guild.
$leaveVc                            # Disconnect the bot from the voice channel. Same as $disconnect.
$joinVc[voiceId?]                   # Join a voice channel using the specified voice channel ID (optional).
$songInfo[query?;index?]            # Get information about the song playing or at a specific index in the queue (optional query and index).

# More functions will be added later...
```

---

## Events

You can listen to various events such as when a track starts, when the player is paused, etc., and respond to them with custom code.

```js
const voice = new MusicClient(client, { ... });      // Initialize the MusicClient instance with the bot client.
voice.loadMusicEvents('path/to/directory', false);   // Load custom music event handlers from a directory. 'false' disables debug logs.
```

**Example Event File** (in `path/to/directory`):

```js
module.exports = [{
    name: 'TrackStart',       // This is an optional property
    channel: '$channelId',    // The ID of the channel where the event will trigger (can be dynamic or static).
    type: 'trackStart',       // The event type, e.g., when a track starts playing ('trackStart').
    code: `$songInfo[title]`  // The action to take when the event is triggered. Here it will return the title of the song.
}]
```
