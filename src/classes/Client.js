const { Connectors, Shoukaku } = require('shoukaku');
const { Collection } = require('discord.js');
const { ClientQueue } = require('./Queue.js');
const { CustomFunctions } = require('./Functions.js');
const { CustomEvent } = require('aoi.js');

exports.Client = class Client extends Shoukaku {
    constructor(client, options) {
        if (!client) throw new Error('Client instance is not defined.');
        if (!options || !options.nodes) throw new Error('There is no nodes provided to connect on!');
        options.nodes = Array.isArray(options.nodes) ? options.nodes : [options.nodes];
        if (!options.maxQueueSize) options.maxQueueSize = 100;
        if (!options.maxPlaylistSize) options.maxPlaylistSize = 100;
        if (!options.searchEngine) options.searchEngine = 'ytsearch';
        if (!options.debug) options.debug = false;
        
        super(new Connectors.DiscordJS(client), options.nodes, {
            moveOnDisconnect: false,
            resume: false,
            reconnectInterval: 30,
            reconnectTries: 2,
            restTimeout: 10000,
            userAgent: options.userAgent || 'NouJS',
            nodeResolver: (nodes) => [...nodes.values()]
                .filter(node => node.state === 2)
                .sort((a, b) => a.penalties - b.penalties)
                .shift(),
        });
        this.client = client;
        this.client.shoukaku = this;
        this.client.musicOptions = options;
        this.events = new CustomEvent(client);
        
        this.cmds = {
            trackStart = new Collection(),
            trackEnd = new Collection(),
            QueueStart = new Collection(),
            QueueEnd = new Collection(),
            trackStuck = new Collection(),
            socketClosed = new Collection(),
        };
        
        this.client.voice = {};
        this.client.voice.events = this.events;
        this.client.voice.cmds = this.cmds;
        this.client.queue = new ClientQueue(this.client, options);
        new CustomFunctions(this.client, options.debug || false);
        this.on('ready', (name, reconnected) => this.emit(reconnected ? 'reconnect' : 'connect', name));
    }

    trackStart(data) {}
    trackEnd(data) {}
    queueStart(data) {}
    queueEnd(data) {}
    trackStuck(data) {}
    socketClosed(data) {}
}

