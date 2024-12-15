exports.Dispatcher = class Dispatcher {
    constructor(options) {
        this.client = options.client;
        this.guildId = options.guildId;
        this.channelId = options.channelId;
        this.player = options.player;
        this.node = options.node;
        this.queue = [];
        this.history = [];
        this.filter = null;
        this.stopped = false;
        this.previous = null;
        this.current = null;
        this.nowPlaying = null;
        this.loop = 'off';
        this.shuffle = false;
        this.paused = false;
        this.autoplay = false;
        this.autoplayType = this.client?.music?.searchEngine || 'ytsearch';
        this.responses = null;
        this.currentVolume = 100;
        this.repeat = 0;
        this.player
            .on('start', () => {
                if (!this.history.length) this.client.shoukaku.emit('queueStart', this.player, this.current, this);
                this.client.shoukaku.emit('trackStart', this.player, this.current, this);
            })
            .on('end', () => {
                this.client.shoukaku.emit('trackEnd', this.player, this.current, this);
            })
            .on('stuck', () => {
                this.client.shoukaku.emit('trackStuck', this.player, this.current)
            })
            .on('closed', (...args) => {
                this.client.shoukaku.emit('socketClosed', this.player, ...args);
            });
    }

    get exists() {
        return this.client.queue.has(this.guildId);
    }

    volume(value) {
        if (!value) { return this.currentVolume };
        if (isNaN(value)) return;
        this.player.setGlobalVolume(value);
        this.currentVolume = value;
    }

    async play() {
        if (!this.exists || (!this.queue.length && !this.current)) return;
        this.current = this.queue.length !== 0 ? this.queue.shift() : this.queue[0];
        if (!this.current) return;
        this.player.playTrack({ track: { encoded: this.current?.encoded }});
        if (this.current) {
            this.history.push(this.current);
            if (this.history.length > 100) {
                this.history.shift();
            }
        }
    }

    pause() {
        if (!this.player) return;
        if (!this.paused) {
            this.player.setPaused(true);
            this.paused = true;
            this.client.shoukaku.emit('trackPaused', this.player, this.current, this);
        } else {
            this.player.setPaused(false);
            this.paused = false;
            this.client.shoukaku.emit('trackResumed', this.player, this.current, this);
        }
    }

    remove(index) {
        if (!this.player) return;
        if (index > this.queue.length) return;
        this.queue.splice(index, 1);
    }

    previousTrack() {
        if (!this.player) return;
        if (!this.previous) return;
        this.queue.unshift(this.previous);
        this.previous = this.history.pop() || null;
        this.player.stopTrack();
    }

    destroy() {
        this.queue.length = 0;
        this.history = [];
        this.client.shoukaku.leaveVoiceChannel(this.guildId);
        this.client.queue.delete(this.guildId);
        if (this.stopped) return;
        this.client.shoukaku.emit('playerDestroy', this.player);
    }

    setShuffle(shuffle) {
        if (!this.player) return;
        this.shuffle = shuffle;
        if (shuffle) {
            const current = this.queue.shift();
            this.queue = this.queue.sort(() => Math.random() - 0.5);
            this.queue.unshift(current);
        } else {
            const current = this.queue.shift();
            this.queue = this.queue.sort((a, b) => a - b);
            this.queue.unshift(current);
        }
    }

    async skip(skipto = 1) {
        if (!this.player) return;
        if (skipto > 1) {
            if (skipto > this.queue.length) {
                this.queue.length = 0;
            } else {
                this.queue.splice(0, skipto - 1);
            }
        }
        this.repeat = this.repeat == 1 ? 0 : this.repeat;
        this.player.stopTrack();
    }

    seek(time) {
        if (!this.player) return;
        this.player.seekTo(time);
    }

    stop() {
        if (!this.player) return;
        this.queue.length = 0;
        this.history = [];
        this.loop = 'off';
        this.autoplay = false;
        this.repeat = 0;
        this.stopped = true;
        this.player.stopTrack();
    }

    setLoop(loop) {
        this.loop = loop;
    }

    buildTrack(track, user) {
        if (!track) throw new Error('Track not provided!');
        if (user) {
            user.avatar = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`
            : `https://cdn.discordapp.com/embed/avatars/0.png`;
        
            user.banner = user.banner
            ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=4096`
            : null;
        }
        
        return {
            encoded: track.encoded,
            info: {
                ...track.info,
                artist: track.info.author,
                thumbnail: track.info.artworkUrl,
                url: track.info.uri,
                duration: this.client.music.utils.formatTime(track.info.length) || 0,
                durationMs: track.info.length,
                requester: { ...user },
                userdata: { ...track.userData },
                plugininfo: { ...track.pluginInfo }
            }
        };
    }

    async isPlaying() {
        if (this.queue.length && !this.current && !this.player.paused) {
            this.play();
        }
    }

    async Autoplay(song, type) {
        if (!song) return;
        const resolve = await this.node.rest.resolve(`${type || this.autoplayType}:${song?.info?.author || song?.info?.title}`);
        if (!resolve || !resolve?.data || !Array.isArray(resolve.data)) return this.stop();
        const metadata = resolve.data;
        let choosed = null;
        const maxAttempts = 10;
        let attempts = 0;
        while (attempts < maxAttempts) {
            const potentialChoice = this.buildTrack(metadata[Math.floor(Math.random() * metadata.length)], { ...this.client.user });
            if (!this.queue.some(s => s.encoded === potentialChoice.encoded) &&
                !this.history.some(s => s.encoded === potentialChoice.encoded)) {
                choosed = potentialChoice;
                break;
            }
            attempts++;
        }
        if (choosed) {
            this.queue.push(choosed);
            this.isPlaying();
            return;
        }
        this.stop();
        return;
    }

    async setAutoplay(autoplay = false, type) {
        this.autoplay = autoplay == true ? true : false;
        if (type) this.autoplayType = type;
        if (autoplay === true) this.Autoplay(this.current ? this.current : this.queue[0], type || this.autoplayType);
    }
};
