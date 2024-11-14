const { Client } = require('./classes/Client.js');

exports.MusicClient = Client;
exports.Events = {
    TrackStart: 'trackStart',
    TrackEnd: 'trackEnd',
    QueueStart: "queueStart",
    QueueEnd: 'queueEnd',
    TrackStuck: 'trackStuck',
    TrackPaused: 'trackPaused',
    TrackResumed: 'trackResumed'
};
