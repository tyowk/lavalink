const { Connectors, Shoukaku } = require('shoukaku');
const { Collection } = require('discord.js');
const { ClientQueue } = require('./Queue.js');
const { CustomFunctions } = require('./Functions.js');
const { MusicEvents } = require('./Events.js');
const { LoadCommands } = require('aoi.js');

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
        this.#client = client;
        this.#client.shoukaku = this;
        this.#client.music = options;
        
        this.cmds = {
            trackStart: new Collection(),
            trackEnd: new Collection(),
            queueStart: new Collection(),
            queueEnd: new Collection(),
            trackStuck: new Collection(),
            trackPaused: new Collection(),
            trackResumed: new Collection(),
        };
        
        this.#client.music.events = [
            'trackStart',
            'trackEnd',
            'trackStuck',
            'trackPaused',
            'trackResumed',
            'queueStart',
            'queueEnd'
        ];
        
        this.#client.music.cmds = this.cmds;
        this.#client.queue = new ClientQueue(this.#client, options);
        new CustomFunctions(this.#client, options.debug || false);
        new MusicEvents(this.#client);
        this.on('ready', (name, reconnected) => this.emit(reconnected ? 'reconnect' : 'connect', name));
    }

    async loadEvents(dir, debug = options.debug || false) {
        const loader = new LoadCommands(this.#client);
        await loader.load(this.cmds, dir, debug);
        this.music.events.forEach(event => this.#bindEvents(event));
    }

    #bindEvents(event) {
        this.on(event, (...data) => {
            const player = data.shift();
            const dispatcher = data.pop();
            
            this.cmds[event].forEach(async (cmd) => {
                if (!cmd.__compiled__) {
                    let channel;

                    if (cmd.channel.startsWith("$")) {
                        const guildId = player.guildId;
                        const guild = this.client.guilds.cache.get(guildId);
                        const channelId = dispatcher.channelId;
                        const channelData = await this.client.functionManager.interpreter(
                            this.client,
                            {
                                guild: guild,
                                channel: this.client.channels.cache.get(channelId),
                            },
                            [],
                            { code: cmd.channel, name: "NameParser" },
                            undefined,
                            true,
                            undefined,
                            {
                                data: data[0],
                                player: player,
                            }
                        );
                        channel = channelData?.code;
                    }
                    const resolvedChannel = this.client.channels.cache.get(channel);
                    return await this.client.functionManager.interpreter(
                        this.client,
                        {
                            guild: this.client.guilds.cache.get(player.guildId),
                            channel: resolvedChannel,
                        },
                        [],
                        cmd,
                        undefined,
                        false,
                        resolvedChannel,
                        {
                            data: data[0],
                         }
                    );
                }

                return await cmd.__compiled__({
                    bot: this.client,
                    client: this.client,
                    channel: this.client.channels.cache.get(dispatcher.channelId),
                    guild: this.client.guilds.cache.get(player.guildId),
                    player: player,
                });
            });
            return event;
        });
    }
}
