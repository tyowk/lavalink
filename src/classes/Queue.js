const { Dispatcher } = require('./Dispatcher.js');

exports.Queue = class Queue extends Map {
    constructor(client, options) {
        super();
        this.client = client;
        this.options = options;
    }

    async create(guild, voice, channel, givenNode) {
        let dispatcher = this.get(guild.id);
        if (!voice) throw new Error('No voice channel was provided');
        if (!channel) throw new Error('No text channel was provided');
        if (!guild) throw new Error('No guild was provided');
        if (!dispatcher) {
            const node = givenNode || this.client.shoukaku.options.nodeResolver(this.client.shoukaku.nodes);
            const player = await this.client.shoukaku.joinVoiceChannel({
                guildId: guild.id,
                channelId: voice.id,
                shardId: guild.shard.id,
                deaf: true,
            });
            dispatcher = new Dispatcher({
                client: this.client,
                guildId: guild.id,
                channelId: channel.id,
                player,
                node,
            });
            this.set(guild.id, dispatcher);
            this.client.shoukaku.emit('playerCreate', dispatcher.player);
            return dispatcher;
        } else {
            return dispatcher;
        }
    }

    async search(query, type) {
        const node = this.client.shoukaku.options.nodeResolver(this.client.shoukaku.nodes);
        const regex = /^https?:\/\//;
        let result;
        try {
            result = await node.rest.resolve(regex.test(query) ? query : `${(type ? type : this.options.searchEngine) || 'ytsearch'}:${query}`);
        } catch (err) {
            return null;
        }
        return result;
    }
}
