const { CustomEvents } = require('aoi.js');
const EventEmitter = require('events');

exports.MusicEvents = class Events {
    constructor(client) {
        this.events = new CustomEvent(client);
        this.cmds = client.music.cmds;
        client.shoukaku.on('trackStart', async () => await EventEmitter.emit('trackStart'));
        client.shoukaku.on('trackEnd', async (p, t, d) => await this.trackEnd(p, t, d));
        client.shoukaku.on('queueStart', async () => await EventEmitter.emit('queueStart'));
        client.shoukaku.on('queueEnd', async (p, t, d) => await this.queueEnd(p, t, d));
        client.shoukaku.on('socketClosed', async () => await EventEmitter.emit('socketClosed'));
    }

    async trackEnd(player, track, dispatcher) {
        EventEmitter.emit('trackEnd');
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        await dispatcher.play();
        if (dispatcher.autoplay) { await dispatcher.Autoplay(track) }
    }
    
    async queueEnd(player, track, dispatcher) {
        EventEmitter.emit('queueEnd');
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        if (dispatcher.autoplay === true) { await dispatcher.Autoplay(track);
        } else { dispatcher.autoplay = false; }
        if (dispatcher.loop === "off") {
            dispatcher.previous = dispatcher.current;
            dispatcher.current = null;
        }
    }

    CustomMusicEvents() {
        this.customTrackStart();
        this.customTrackEnd();
        this.customQueueStart();
        this.customQueueEnd();
        this.customSocketClosed();
    }

    customTrackStart() {
        this.cmds.trackStart.forEach(event => {
            this.events.command({
                listen: event.type || 'trackStart',
                channel: event.channel || '$channelId',
                code: event.code,
            });
            this.events.listen('trackStart');
        });
    }

    customTrackEnd() {
        this.cmds.trackEnd.forEach(event => {
            this.events.command({
                listen: event.type || 'trackEnd',
                channel: event.channel || '$channelId',
                code: event.code,
            });
            this.events.listen('trackEnd');
        });
    }

    customQueueStart() {
        this.cmds.queueStart.forEach(event => {
            this.events.command({
                listen: event.type || 'queueStart',
                channel: event.channel || '$channelId',
                code: event.code,
            });
            this.events.listen('queueStart');
        });
    }

    customQueueEnd() {
        this.cmds.queueEnd.forEach(event => {
            this.events.command({
                listen: event.type || 'queueEnd',
                channel: event.channel || '$channelId',
                code: event.code,
            });
            this.events.listen('queueEnd');
        });
    }

    customSocketClosed() {
        this.cmds.socketClosed.forEach(event => {
            this.events.command({
                listen: event.type || 'socketClosed',
                channel: event.channel || '$channelId',
                code: event.code,
            });
            this.events.listen('socketClosed');
        });
    }
}
