const { Shoukaku, Connectors } = require('shoukaku');
const { ClientQueue } = require('./Queue.js');
const { CustomFunctions } = require('./Functions.js');
const { MusicEvents } = require('./Events.js');
const { LoadCommands } = require('aoi.js');
const { CommandManager } = require('aoi.js/classes/Commands.js');
const { Group } = require('@aoijs/aoi.structures');

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
            resumeByLibrary: options.resumeByLibrary || false,
            resumeTimeout: options.resumeTimeout || 30,
            reconnectInterval: options.reconnectInterval || 5,
            reconnectTries: options.reconnectTries || 3,
            restTimeout: options.restTimeout || 60,
            userAgent: options.userAgent || '(auto)',
            voiceConnectionTimeout: options.voiceConnectionTimeout || 15,
            structures: options.structures || {},
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
        this.client.music.utils = require('./Utils.js');

        this.cmd = new CommandManager(this, false, [
            'trackStart', 'trackEnd', 'queueStart',
            'queueEnd', 'trackStuck', 'trackPaused',
            'trackResumed', 'nodeConnect', 'nodeReconnect',
            'nodeDisconnect', 'nodeError', 'nodeDestroy',
            'nodeRaw', 'socketClosed', 'playerCreate',
            'playerDestroy'
        ]);
        
        this.client.music.cmds = this.cmd;
        this.client.queue = new ClientQueue(this.client, options);
        new CustomFunctions(this.client, options.debug);
        new MusicEvents(this);
        Object.entries(this.cmds).forEach(event => this.#bindEvents(event[0]));
    }

    loadVoiceEvents(dir, debug = this.client.music.debug || false) {
        if (!this.client.loader) this.client.loader = new LoadCommands(this.client);
        this.client.loader.load(this.cmds, dir, debug);
    }

    voiceEvent(name, evt = {}) {
        if (!evt || !evt.code) return;
        const collection = this.cmds[name];
        if (!collection) return;
        collection.set(collection.size, evt);
    }

    #bindEvents(event) {
        this.on(event, async (player, track, dispatcher) => {
            const commands = this.cmds[event];
            if (!commands) return;
            
            for (const cmd of commands.values()) {
                const guild = this.client.guilds.cache.get(player?.guildId);
                const channel = this.client.channels.cache.get(dispatcher?.channelId) || this.client.channels.cache.get(cmd.channel);
                if (!cmd.__compiled__) {
                    await this.client.functionManager.interpreter(
                        this.client, { guild, channel }, [], cmd,
                        undefined, false, channel, { player, track, dispatcher }
                    );
                } else {
                    const client = this.client;
                    await cmd.__compiled__({ client, channel, guild, player, track, dispatcher });
                }
            }
            return event;
        });
    }
};
