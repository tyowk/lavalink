const { LoadType } = require('shoukaku');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [query, type, debug] = data.inside.splits;

    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    
    if (!query) return d.aoiError.fnError(d, "custom", {}, `Please provide the title or link of the song you want to play.`);
    if (!type) type = d.client.music.searchEngine;
    type = type?.toLowerCase()
        .replace('youtube', 'ytsearch')
        .replace('spotify', 'spsearch')
        .replace('soundcloud', 'scsearch')
        .replace('deezer', 'dzsearch')
        .replace('youtubemusic', 'ytmsearch')
        .replace('applemusic', 'amsearch');

    if (!d.member?.voice?.channel) return d.aoiError.fnError(d, "custom", {}, `You are not connected to any voice channels.`);
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild.`);
    if (player.channelId !== d.channel?.id) player.channelId = d.channel.id;
    
    let debugResult;
    const res = (player.responses && player.responses?.query === query?.addBrackets())
        ? player.responses
        : await d.client.queue.search(query?.addBrackets(), type);
    
    setTimeout(() => {
        if (player?.responses)
            player.responses = null;
    }, 5000);
    
    const maxQueueSize = Number(d.client.music.maxQueueSize) || 100;
    const maxPlaylistSize = Number(d.client.music.maxPlaylistSize) || 100;

    switch (res?.loadType) {
        case LoadType.TRACK: {
            if (player.queue.length >= maxQueueSize) {
                d.aoiError.fnError(d, "custom", {}, `The queue length is too long. The maximum length is ${maxQueueSize} songs.`);
                break;
            };
            debugResult = 'track';
            const track = player.buildTrack(res.data, d.author);
            player.queue.push(track);
            player.isPlaying();
            break;
        }
        case LoadType.PLAYLIST: {
            if (res.data.tracks.length > maxPlaylistSize) {
                d.aoiError.fnError(d, "custom", {}, `The playlist length is too long. The maximum length is ${maxPlaylistSize} songs.`);
                break;
            };
            for (const track of res.data.tracks) {
                if (player.queue.length >= maxQueueSize) {
                    d.aoiError.fnError(d, "custom", {}, `The queue length is too long. The maximum length is ${maxQueueSize} songs.`);
                    break;
                }
                const playlist = player.buildTrack(track, d.author);
                player.queue.push(playlist);
            };
            debugResult = 'playlist';
            player.isPlaying();
            break;
        }
        case LoadType.SEARCH: {
            if (!Array.isArray(res.data) || res.data.length === 0) {
                return d.aoiError.fnError(d, "custom", {}, `There were no results found.`);
            }
            const track = player.buildTrack(res.data[0], d.author);
            if (player.queue.length >= maxQueueSize) {
                d.aoiError.fnError(d, "custom", {}, `The queue length is too long. The maximum length is ${maxQueueSize} songs.`);
                break;
            };
            player.queue.push(track);
            debugResult = 'search';
            player.isPlaying();
            break;
        }
        default: {
            debugResult = 'error';
            d.aoiError.fnError(d, "custom", {}, `There were no results found.`);
            break;
        }
    }

    if (debug && debug == 'true') data.result = debugResult;
    return {
        code: d.util.setCode(data)
    }
}
