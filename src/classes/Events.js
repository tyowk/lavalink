exports.MusicEvents = class Events {
    constructor(client) {
        client.shoukaku.on('trackStart', async (player, track, dispatcher) => await this.trackStart(player, track, dispatcher));
        client.shoukaku.on('trackEnd', async (player, track, dispatcher) => await this.trackEnd(player, track, dispatcher));
        client.shoukaku.on('queueStart', async (player, track, dispatcher) => await this.queueStart(player, track, dispatcher));
        client.shoukaku.on('queueEnd', async (player, track, dispatcher) => await this.queueEnd(player, track, dispatcher));
    }

    async trackStart(player, track, dispatcher) {}
    async trackEnd(player, track, dispatcher) {
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        await dispatcher.play();
        if (dispatcher.autoplay) { await dispatcher.Autoplay(track) }
    }
    
    async queueStart(player, track, dispatcher) {}
    async queueEnd(player, track, dispatcher) {
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
