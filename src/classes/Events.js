const { CustomEvents } = require('aoi.js');

exports.MusicEvents = class Events {
    constructor(client) {
        this.events = new CustomEvent(client);
        this.cmds = client.music.cmds;
        client.shoukaku.on('trackStart', async () => await this.events.emit('trackStart'));
        client.shoukaku.on('trackEnd', async (p, t, d) => await this.trackEnd(p, t, d));
        client.shoukaku.on('queueStart', async () => await this.events.emit('queueStart'));
        client.shoukaku.on('queueEnd', async (p, t, d) => await this.queueEnd(p, t, d));
        client.shoukaku.on('socketClosed', async () => await this.events.emit('socketClosed'));
    }

    async trackEnd(player, track, dispatcher) {
        this.events.emit('trackEnd');
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        await dispatcher.play();
        if (dispatcher.autoplay) { await dispatcher.Autoplay(track) }
    }
    
    async queueEnd(player, track, dispatcher) {
        this.events.emit('queueEnd');
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        if (dispatcher.autoplay === true) { await dispatcher.Autoplay(track);
        } else { dispatcher.autoplay = false; }
        if (dispatcher.loop === "off") {
            dispatcher.previous = dispatcher.current;
            dispatcher.current = null;
        }
    }
}
