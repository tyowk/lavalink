exports.MusicEvents = class Events {
    constructor(client) {
        this.shoukaku = client.shoukaku;
        this.shoukaku.on('trackStart', (player, track, dispatcher) => this.trackStart(player, track, dispatcher));
        this.shoukaku.on('trackEnd', (player, track, dispatcher) => this.trackStart(player, track, dispatcher));
        this.shoukaku.on('queueStart', (player, track, dispatcher) => this.queueStart(player, track, dispatcher));
        this.shoukaku.on('queueEnd', (player, track, dispatcher) => this.queueEnd(player, track, dispatcher));
    }

    trackStart(player, track, dispatcher) {}
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
            if (dispatcher.queue.length > 0) return;
            await dispatcher.destroy();
        }
    }
}
