exports.MusicEvents = class Events {
    constructor(client) {
        this.client = client;
        this.client.shoukaku.on('trackStart', (player, track, dispatcher) => this.trackStart(player, track, dispatcher));
        this.client.shoukaku.on('trackEnd', (player, track, dispatcher) => this.trackStart(player, track, dispatcher));
        this.client.shoukaku.on('queueStart', (player, track, dispatcher) => this.queueStart(player, track, dispatcher));
        this.client.shoukaku.on('queueEnd', (player, track, dispatcher) => this.queueEnd(player, track, dispatcher));
    }

    trackStart(player, track, dispatcher) {
        
    }
    
    trackEnd(player, track, dispatcher) {
        
    }
    
    queueStart(player, track, dispatcher) {
        
    }
    
    queueEnd(player, track, dispatcher) {
        
    }
}
