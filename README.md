> [!IMPORTANT]  
> **UNDER DEVELOPMENT!**  
> This project is under development. Features may change, and some functions may not work as expected.

---

## Setup

The setup is used to initialize the bot client and configure the Lavalink music system. Aoi.js is the main client framework, and Aoi.Lavalink is an integration that allows you to connect to a Lavalink server to stream music.

```js
const { AoiClient } = require('aoi.js');
const { MusicClient } = require('aoi.lavalink'); // Importing the MusicClient for handling Lavalink integration.

const client = new AoiClient({ ... });

const voice = new MusicClient(client, {
    nodes: [{
        name: 'my lavalink node',  // A custom name for the Lavalink node (can be any string).
        url: 'someurl.com:0000',  // URL to your Lavalink node. Replace with your actual Lavalink server URL.
        auth: 'youshallnotpass',  // Authentication password for the Lavalink node.
        secure: false  // Set to true if your Lavalink server uses SSL/TLS (HTTPS).
    }],
    maxQueueSize: 100,  // Maximum number of tracks that can be queued for playback.
    maxPlaylistSize: 100,  // Maximum number of tracks that can be in a playlist.
    searchEngine: 'ytsearch',  // Default search engine. You can set this to 'ytsearch' (YouTube) or 'scsearch' (SoundCloud) or others.
    debug: false  // Whether to enable debug logs for the music client.
});
```

**Explanation**:  
- The `AoiClient` initializes the main bot with its token, command prefix, and required intents.
- The `MusicClient` integrates Lavalink into the bot. Lavalink is a separate server used for music streaming. You configure it with a Lavalink node (your server's address) and its authentication settings.

---

## Functions

These are the core music commands and functions available for the bot. 

```bash
$playTrack[query;engine?]    # Play a track based on a search query or URL. You can specify the engine, like 'ytsearch' (YouTube) or 'scsearch' (SoundCloud).
$stopTrack                   # Stop the current track and clear the queue.
$disconnect                  # Disconnect the bot from the voice channel.
$connect[voiceId?]           # Connect the bot to a voice channel by specifying the voice channel ID (optional).
$hasPlayer[guildId?]         # Check if the bot already has a player (is playing music) in the specified guild.
$leaveVc                     # Disconnect the bot from the voice channel. Same as $disconnect.
$joinVc[voiceId?]            # Join a voice channel using the specified voice channel ID (optional).
$songInfo[query?;index?]     # Get information about the song playing or at a specific index in the queue (optional query and index).
```

**Explanation**:  
- `$playTrack`: Starts playing a track based on a search query or URL. You can use YouTube search by default or other search engines if configured.
- `$stopTrack`: Stops the current track and clears the playback queue.
- `$disconnect` and `$leaveVc`: Both commands are used to disconnect the bot from the voice channel.
- `$connect` and `$joinVc`: Connects the bot to a specific voice channel.
- `$hasPlayer`: Checks if a player exists for the specified guild.
- `$songInfo`: Fetches information about the currently playing track, or a track from the queue by index.

---

## Events

You can listen to various events such as when a track starts, when the player is paused, etc., and respond to them with custom code.

```js
const voice = new MusicClient(client, { ... });  // Initialize the MusicClient instance with the bot client.

voice.loadMusicEvents('path/to/directory', false);  
// Load custom music event handlers from a directory. 'false' disables debug logs.

```

**Example Event File** (in `path/to/directory`):

```js
module.exports = [{
    channel: '$channelId',  // The ID of the channel where the event will trigger (can be dynamic or static).
    type: 'trackStart',      // The event type, e.g., when a track starts playing ('trackStart').
    code: `$songInfo[title]` // The action to take when the event is triggered. Here it will return the title of the song.
}]
```

**Explanation**:  
- `loadMusicEvents`: Loads event handler files from the specified directory. Each file can define multiple events for specific actions.
- Event types like `trackStart`, `trackEnd`, `trackResumed`, `trackPaused`, `queueStart`, `queueEnd`, `trackStuck`, are triggered during specific moments in the music player’s lifecycle.
- Inside the event file, you can define the `type` of event and the `code` to execute when that event happens. You can also use dynamic data like `$channelId` for flexibility.
