const { CustomEvents } = require('aoi.js');

exports.MusicEvents = class Events {
    constructor(client) {
        this.events = new CustomEvent(client);
        client.shoukaku.on('trackStart', async (p, t, d) => await this.trackStart(p, t, d));
        client.shoukaku.on('trackEnd', async (p, t, d) => await this.trackEnd(p, t, d));
        client.shoukaku.on('queueStart', async (p, t, d) => await this.queueStart(p, t, d));
        client.shoukaku.on('queueEnd', async (p, t, d) => await this.queueEnd(p, t, d));
    }

    async trackStart(player, track, dispatcher) {
        this.events.emit('trackStart');
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
    
    async queueStart(player, track, dispatcher) {
        this.events.emit('queueStart');
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
