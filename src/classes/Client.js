const { Shoukaku, Connectors } = require('shoukaku');
const { Collection } = require('discord.js');
const { ClientQueue } = require('./Queue.js');
const { CustomFunctions } = require('./Functions.js');
const { MusicEvents } = require('./Events.js');
const { LoadCommands } = require('aoi.js');

exports.Client = class Client extends Shoukaku {
    constructor(client, options) {
        if (!client) throw new Error('Client instance is not defined.');
        if (!options || !options.nodes) throw new Error('No nodes provided to connect on.');
        options.nodes = Array.isArray(options.nodes) ? options.nodes : [options.nodes];
        options.maxQueueSize = options.maxQueueSize || 100;
        options.maxPlaylistSize = options.maxPlaylistSize || 100;
        options.searchEngine = options.searchEngine || 'ytsearch';
        options.debug = options.debug || false;

        super(new Connectors.DiscordJS(client), options.nodes, {
            moveOnDisconnect: options.moveOnDisconnect || false,
            resume: options.resume || false,
            reconnectInterval: options.reconnectInterval || 30,
            reconnectTries: options.reconnectTries || 2,
            restTimeout: options.restTimeout || 10000,
            userAgent: options.userAgent || 'Aoi.Lavalink',
            nodeResolver: (nodes) => {
                return [...nodes.values()]
                    .filter(node => node.state === 2)
                    .sort((a, b) => a.penalties - b.penalties)
                    .shift();
            },
        });

        this.client = client;
        this.client.shoukaku = this;
        this.client.music = options;

        this.cmds = {
            trackStart: new Collection(),
            trackEnd: new Collection(),
            queueStart: new Collection(),
            queueEnd: new Collection(),
            trackStuck: new Collection(),
            trackPaused: new Collection(),
            trackResumed: new Collection(),
            nodeConnect: new Collection(),
            nodeReconnect: new Collection(),
            nodeDisconnect: new Collection(),
            nodeError: new Collection(),
            nodeDestroy: new Collection(),
            nodeRaw: new Collection(),
            socketClosed: new Collection(),
            playerDestroy: new Collection()
        };
        
        this.client.music.cmds = this.cmds;
        this.client.queue = new ClientQueue(this.client, options);
        new CustomFunctions(this.client, options.debug);
        new MusicEvents(this);
    }

    async loadVoiceEvents(dir, debug = this.client.music.debug || false) {
        if (!this.client.loader) this.client.loader = new LoadCommands(this.client);
        await this.client.loader.load(this.cmds, dir, debug);
        Object.entries(this.cmds).forEach(event => this.#bindEvents(event[0]));
    }

    voiceEvent(name, evt = {}) {
        if (!evt || !evt.code) return;
        const collection = this.cmds[name];
        if (!collection) return;
        collection.set(collection.size, evt);
        this.#bindEvents(name);
    }

    #bindEvents(event) {
        this.on(event, async (player, track, dispatcher) => {
            const commands = this.cmds[event];
            if (!commands) return;
            for (const cmd of commands.values()) {
                const channel = this.client.channels.cache.get(dispatcher?.channelId) || this.client.channels.cache.get(cmd.channel) || undefined;
                const guild = this.client.guilds.cache.get(player?.guildId) || undefined;
                await this.client.functionManager.interpreter(
                    this.client,
                    { guild: guild, author: player?.current?.info?.requester || undefined, channel: channel },
                    [], { name: cmd.name || event, code: cmd.code },
                    this.client.db, false, channel, {}, channel, true
                );
            }
        });
    }
};
