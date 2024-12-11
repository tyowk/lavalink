const chalk = require('chalk');

exports.MusicEvents = class Events {
    constructor(client) {
        const log = (msg) => {
            if (!(client?.client?.music?.debug ? true : false)) return;
            console.log(msg);
        };
        
        client.on('trackEnd', async (p, t, d) => await this.trackEnd(p, t, d));
        client.on('queueEnd', async (p, t, d) => await this.queueEnd(p, t, d));
        client.on('nodeConnect', (name) => log(`[${chalk.blue('DEBUG')}] :: Node ${chalk.cyan(`${name}`)} connected`));
        client.on('nodeReconnect', (name) => log(`[${chalk.blue('DEBUG')}] :: Node ${chalk.yellow(`${name}`)} reconnected`));
        client.on('nodeError', (name, error) => log(`[${chalk.blue('DEBUG')}] :: Node ${chalk.red(`${name}`)} error: `, error));
        client.on('nodeDestroy', (name, code, reason) => log(`[${chalk.blue('DEBUG')}] :: Node ${chalk.red(`${name}`)} destroyed with reason: `, reason));
        client.on('nodeDisconnect', (name, reason) => log(`[${chalk.blue('DEBUG')}] :: Node ${chalk.red(`${name}`)} disconnected with reason: `, reason));
        
        client.on('ready', (name, reconnected) => client.emit(reconnected ? 'nodeReconnect' : 'nodeConnect', name));
        client.on('error', (name, error) => client.emit('nodeError', name, error));
        client.on('close', (name, code, reason) => client.emit('nodeDestroy', name, code, reason));
        client.on('disconnect', (name, count) => client.emit('nodeDisconnect', name, count));
        client.on('debug', (name, reason) => client.emit('nodeRaw', name, reason));
    }

    async trackEnd(player, track, dispatcher, client) {
        if (dispatcher.loop === 'repeat') dispatcher.queue.unshift(track);
        if (dispatcher.loop === 'queue') dispatcher.queue.push(track);
        if (dispatcher.autoplay === true) { await dispatcher.Autoplay(track); }
        else { dispatcher.autoplay = false; };
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        await dispatcher.play();
    }
    
    async queueEnd(player, track, dispatcher) {
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        if (dispatcher.autoplay === true) { await dispatcher.Autoplay(track) }
        else { dispatcher.autoplay = false; };
        if (dispatcher.loop === "off") {
            dispatcher.previous = dispatcher.current;
            dispatcher.current = null;
        }
    }
}
