const { Shoukaku, Connectors } = require('shoukaku');
const { Queue } = require('./Queue.js');
const { Functions } = require('./Functions.js');
const { Events } = require('./Events.js');
const { LoadCommands } = require('aoi.js');
const { Group } = require('@aoijs/aoi.structures');
const { join } = require('node:path');

exports.Manager = class Manager extends Shoukaku {
    constructor(client, options = {}) {
        if (!client) throw new Error('Client instance is not defined.');
        if (!options.nodes) throw new Error('No nodes provided to connect on.');
        options.nodes = Array.isArray(options.nodes) ? options.nodes : [options.nodes];
        options.nodes = options.nodes.map(({ host, port, url, ...nodes }) => ({
            ...nodes,
            url: (url && !host && !port) ? url : `${host}:${port}`
        }));
        options.maxQueueSize = options.maxQueueSize || 100;
        options.maxPlaylistSize = options.maxPlaylistSize || 100;
        options.debug = options.debug || false;
        options.searchEngine = options.searchEngine?.toLowerCase()
            .replace('youtube', 'ytsearch')
            .replace('spotify', 'spsearch')
            .replace('soundcloud', 'scsearch')
            .replace('deezer', 'dzsearch')
            .replace('youtubemusic', 'ytmsearch') || 'ytsearch';
        
        super(new Connectors.DiscordJS(client), options.nodes, {
            moveOnDisconnect: options.moveOnDisconnect || false,
            resume: options.resume || false,
            resumeByLibrary: options.resumeByLibrary || false,
            resumeTimeout: options.resumeTimeout || 30,
            reconnectInterval: options.reconnectInterval || 5,
            reconnectTries: options.reconnectTries || 3,
            restTimeout: options.restTimeout || 60,
            userAgent: options.userAgent || 'aoijs.lavalink',
            voiceConnectionTimeout: options.voiceConnectionTimeout || 15,
            structures: options.structures || {},
            nodeResolver: (nodes) => {
                return [...nodes.values()]
                    .filter(node => node.state === 2)
                    .sort((a, b) => a.penalties - b.penalties)
                    .shift();
            },
        });
        
        this.cmd = {
            trackStart: new Group(),
            trackEnd: new Group(),
            queueStart: new Group(),
            queueEnd: new Group(),
            trackStuck: new Group(),
            trackPaused: new Group(),
            trackResumed: new Group(),
            nodeConnect: new Group(),
            nodeReconnect: new Group(),
            nodeDisconnect: new Group(),
            nodeError: new Group(),
            nodeDestroy: new Group(),
            nodeRaw: new Group(),
            socketClosed: new Group(),
            playerCreate: new Group(),
            playerDestroy: new Group()
        };

        this.client = client;
        this.client.shoukaku = this;
        this.client.queue = new Queue(this.client, options);
        this.client.loadVoiceEvents = this.loadVoiceEvents.bind(this);
        this.client.voiceEvent = this.voiceEvent.bind(this);
        this.client.music = {
            ...options,
            utils: require('./Utils.js').Utils,
            cmd: this.cmd
        };
        
        new Functions(this.client, join(__dirname, '..', 'functions'), options.debug);
        new Events(this);
        Object.keys(this.cmd).forEach((event) => this.#bindEvents(event));
    }

    #bindEvents(event) {
        this.on(event, async (player, track, dispatcher) => {
            const commands = this.cmd[event];
            if (!commands) return;
            for (const cmd of commands.values()) {
                const guild = this.client.guilds.cache.get(player?.guildId);
                let channel = this.client.channels.cache.get(cmd.channel) || this.client.channels.cache.get(dispatcher?.channelId);
                if (!cmd.__compiled__) {
                    if (cmd.channel?.startsWith("$")) {
                        channel = this.client.channels.cache.get((await this.client.functionManager.interpreter(
                            this.client, { guild, channel }, [], { code: cmd.channel, name: 'NameParser' },
                            undefined, true, undefined, { player, track, dispatcher }
                        ))?.code);
                    };
                    if (!channel) channel = this.client.channels.cache.get(dispatcher?.channelId);
                    await this.client.functionManager.interpreter(
                        this.client, { guild, channel }, [], cmd,
                        undefined, false, channel, { player, track, dispatcher }
                    );
                } else {
                    const client = this.client;
                    await cmd.__compiled__({ client, channel, guild, player, track, dispatcher });
                };
            };
        });
    }

    loadEvents(dir, debug = this.client.music.debug || false) {
        if (!this.client.loader) this.client.loader = new LoadCommands(this.client);
        this.client.loader.load(this.cmd, dir, debug);
    }

    voiceEvent(name, evt = {}) {
        if (!evt || !evt.code) return;
        const cmd = this.cmd[name];
        if (!cmd) return;
        cmd.set(cmd.size, evt);
    }
    
    trackStart(cmd) {
        this.voiceEvent('trackStart', cmd);
    }

    trackEnd(cmd) {
        this.voiceEvent('trackStart', cmd);
    }

    queueStart(cmd) {
        this.voiceEvent('queueStart', cmd);
    }

    queueEnd(cmd) {
        this.voiceEvent('queueEnd', cmd);
    }

    trackStuck(cmd) {
        this.voiceEvent('trackStuck', cmd);
    }

    trackPaused(cmd) {
        this.voiceEvent('trackPaused', cmd);
    }

    trackResumed(cmd) {
        this.voiceEvent('trackResumed', cmd);
    }

    nodeConnect(cmd) {
        this.voiceEvent('nodeConnect', cmd);
    }

    nodeReconnect(cmd) {
        this.voiceEvent('nodeReconnect', cmd);
    }

    nodeDisconnect(cmd) {
        this.voiceEvent('nodeDisconnect', cmd);
    }

    nodeError(cmd) {
        this.voiceEvent('nodeError', cmd);
    }

    nodeDestroy(cmd) {
        this.voiceEvent('nodeDestroy', cmd);
    }

    nodeRaw(cmd) {
        this.voiceEvent('nodeRaw', cmd);
    }

    socketClosed(cmd) {
        this.voiceEvent('socketClosed', cmd);
    }

    playerCreate(cmd) {
        this.voiceEvent('playerCreate', cmd);
    }

    playerDestroy(cmd) {
        this.voiceEvent('playerDestroy', cmd);
    }
};
