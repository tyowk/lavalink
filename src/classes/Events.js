exports.MusicEvents = class Events {
    constructor(client) {
        this.client = client;
    }

    trackStart() {}
    trackEnd() {}
    queueStart() {}
    queueEnd() {}
}
