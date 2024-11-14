> [!IMPORTANT]
> **UNDER DEVELOPMENT!**
<br>
<br>

```js
const { AoiClient } = require('aoi.js');
const { MusicClient } = require('aoi.lavalink');

const client = new AoiClient({
    // your client options...
});

new MusicClient(client, {
    nodes: [{
        name: 'my lavalink node',
        url: 'someurl.com:0000',
        auth: 'youshallnotpass',
        secure: false
    }],
    maxQueueSize: 100,
    maxPlaylistSize: 100,
    searchEngine: 'ytsearch',
    debug: false
});
```
