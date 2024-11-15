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
        options.events = Array.isArray(options.events) ? options.events : [options.events];
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
            nodeResolver: options.nodeResolver || (nodes) => {
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
        };

        this.client.music.cmds = this.cmds;
        this.client.queue = new ClientQueue(this.client, options);
        new CustomFunctions(this.client, options.debug);
        new MusicEvents(this.client);
        this.on('ready', (name, reconnected) => this.emit(reconnected ? 'reconnect' : 'connect', name));
    }

    async loadMusicEvents(dir, debug = this.client.music.debug || false) {
        if (!this.client.loader) this.client.loader = new LoadCommands(this.client);
        await this.client.loader.load(this.cmds, dir, debug);
        this.client.music.events.forEach(event => this.#bindEvents(event));
    }

    addMusicEvent(name, evt = {}) {
        if (!evt || !evt.code) return;
        const collection = this.cmds[name];
        if (!collection) return;
        collection.set(collection.size, cmd);
        this.#bindEvents(name);
    }

    #bindEvents(event) {
        this.on(event, async (...data) => {
            const player = data.shift();
            const dispatcher = data.pop();

            const commands = this.cmds[event];
            if (!commands) return;

            for (const cmd of commands.values()) {
                if (!cmd.__compiled__) {
                    let channel;

                    if (cmd.channel.startsWith("$")) {
                        const guildId = player.guildId;
                        const guild = this.client.guilds.cache.get(guildId);
                        const channelId = dispatcher.channelId;
                        try {
                            const channelData = await this.client.functionManager.interpreter(
                                this.client,
                                { guild, channel: this.client.channels.cache.get(channelId) },
                                [],
                                { code: cmd.channel, name: "NameParser" },
                                undefined,
                                true,
                                undefined,
                                { data: data[0], player }
                            );
                            channel = channelData?.code;
                        } catch (err) {
                            console.error("Error resolving channel:", err);
                        }
                    }
                    
                    const resolvedChannel = this.client.channels.cache.get(channel);
                    if (resolvedChannel) {
                        await this.client.functionManager.interpreter(
                            this.client,
                            { guild: this.client.guilds.cache.get(player.guildId), channel: resolvedChannel },
                            [],
                            cmd,
                            undefined,
                            false,
                            resolvedChannel,
                            { data: data[0] }
                        );
                    }
                } else {
                    await cmd.__compiled__({
                        bot: this.client,
                        client: this.client,
                        channel: this.client.channels.cache.get(dispatcher.channelId),
                        guild: this.client.guilds.cache.get(player.guildId),
                        player,
                    });
                }
            }
            return event;
        });
    }
};
