const { CustomEvents } = require('aoi.js');
const EventEmitter = require('events');

exports.MusicEvents = class Events extends EventEmitter {
    constructor(client) {
        super();
        this.evt = new CustomEvents(client);
        this.cmds = client.music.cmds || {};
        client.shoukaku.on('trackStart', async () => this.emit('trackStart'));
        client.shoukaku.on('trackEnd', async (p, t, d) => await this.trackEnd(p, t, d));
        client.shoukaku.on('queueStart', async () => this.emit('queueStart'));
        client.shoukaku.on('queueEnd', async (p, t, d) => await this.queueEnd(p, t, d));
        client.shoukaku.on('socketClosed', async () => this.emit('socketClosed'));
        this.customMusicEvents();
    }

    async trackEnd(player, track, dispatcher) {
        this.emit('trackEnd');
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        await dispatcher.play();
        if (dispatcher.autoplay) { await dispatcher.Autoplay(track) }
    }
    
    async queueEnd(player, track, dispatcher) {
        this.emit('queueEnd');
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        if (dispatcher.autoplay === true) { await dispatcher.Autoplay(track);
        } else { dispatcher.autoplay = false; }
        if (dispatcher.loop === "off") {
            dispatcher.previous = dispatcher.current;
            dispatcher.current = null;
        }
    }

    customMusicEvents() {
        this.customTrackStart();
        this.customTrackEnd();
        this.customQueueStart();
        this.customQueueEnd();
        this.customTrackStuck();
        this.customSocketClosed();
    }

    customTrackStart() {
        this.cmds.trackStart.forEach(evt => {
            this.evt.command({
                listen: 'trackStart',
                channel: '$channelId',
                code: evt.code
            });
        });
        this.evt.listen('trackStart');
    }

    customTrackEnd() {
        this.cmds.trackEnd.forEach(evt => {
            this.evt.command({
                listen: 'trackEnd',
                channel: '$channelId',
                code: evt.code
            });
        });
        this.evt.listen('trackEnd');
    }

    customQueueStart() {
        this.cmds.queueStart.forEach(evt => {
            this.evt.command({
                listen: 'queueStart',
                channel: '$channelId',
                code: evt.code
            });
        });
        this.evt.listen('queueStart');
    }

    customQueueEnd() {
        this.cmds.queueEnd.forEach(evt => {
            this.evt.command({
                listen: 'queueEnx',
                channel: '$channelId',
                code: evt.code
            });
        });
        this.evt.listen('queueEnd');
    }

    customTrackStuck() {
        this.cmds.trackStuck.forEach(evt => {
            this.evt.command({
                listen: 'trackStuck',
                channel: '$channelId',
                code: evt.code
            });
        });
        this.evt.listen('trackStuck');
    }

    customSocketClosed() {
        this.cmds.socketClosed.forEach(evt => {
            this.evt.command({
                listen: 'socketClosed',
                channel: '$channelId',
                code: evt.code
            });
        });
        this.evt.listen('socketClosed');
    }
}
