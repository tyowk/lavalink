exports.MusicEvents = class Events {
    constructor(client) {
        (async () => {
            await client.on('trackEnd', async (p, t, d) => await this.trackEnd(p, t, d));
            client.on('queueEnd', async (p, t, d) => await this.queueEnd(p, t, d));
        });
        
        client.on('ready', (name, reconnected) => client.emit(reconnected ? 'nodeReconnect' : 'nodeConnect', name));
        client.on('error', (name, error) => client.emit('nodeError', name, error));
        client.on('close', (name, code, reason) => client.emit('nodeDestroy', name, code, reason));
        client.on('disconnect', (name, count) => client.emit('nodeDisconnect', name, count));
        client.on('debug', (name, reason) => client.emit('nodeRaw', name, reason));
    }

    async trackEnd(player, track, dispatcher) {
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        await dispatcher.play();
        if (dispatcher.autoplay) { await dispatcher.Autoplay(track) }
    }
    
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
