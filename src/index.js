const { Client } = require('./classes/Client.js');
exports.MusicClient = Client;

exports.Events = {
    TrackStart: 'trackStart',
    TrackEnd: 'trackEnd',
    QueueStart: 'queueStart',
    QueueEnd: 'queueEnd',
    TrackStuck: 'trackStuck',
    TrackPaused: 'trackPaused',
    TrackResumed: 'trackResumed',
    NodeConnect: 'nodeConnect',
    NodeReconnect: 'nodeReconnect',
    NodeDisconnect: 'nodeDisconnect',
    NodeError: 'nodeError',
    NodeDestroy: 'nodeDestroy',
    NodeRaw: 'nodeRaw',
    SocketClosed: 'socketClosed',
    PlayerCreate: 'playerCreate',
    PlayerDestroy: 'playerDestroy'
};
