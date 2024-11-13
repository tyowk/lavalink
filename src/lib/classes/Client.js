const { Connectors, Shoukaku } = require('shoukaku');

exports.Music = class Music extends Shoukaku {
    constructor(client, options) {
        if (!options || !options.nodes) throw new Error('There is no nodes provided to connect on!');
        if (options.nodes) options.nodes = Array.isArray(options.nodes) ? options.nodes : [options.nodes];
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
        this.on('ready', (name, reconnected) => this.emit(reconnected ? 'reconnect' : 'connect', name));
    }
}

