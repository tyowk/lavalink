const { LoadType } = require('shoukaku');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [query, type, debug] = data.inside.splits;
    if (!query) return d.aoiError.fnError(d, "custom", {}, `Please provide the title or link of the song you want to play!`);
    if (!type) type = 'youtube';
    type = type?.toLowerCase()
        .replace('youtube', 'ytsearch')
        .replace('spotify', 'spsearch')
        .replace('soundcloud', 'scsearch')
        .replace('deezer', 'dzsearch')
        .replace('youtubemusic', 'ytmsearch')
        .replace('applemusic', 'amsearch');

    if (!d.member?.voice?.channel) return d.aoiError.fnError(d, "custom", {}, `You are not connected to any voice channels.`);
    let player = d.client.queue.get(d.guild.id);
    if (!player)
       player = await d.client.queue.create(
           d.guild,
           d.member?.voice?.channel,
           d.channel
       );

    let debugResult;
    const res = await d.client.queue.search(query, type);
    switch (res?.loadType) {
        case LoadType.ERROR: {
            d.aoiError.fnError(d, "custom", {}, `There was an error while searching.`);
            debugResult = 'error';
            break;
        }
        case LoadType.EMPTY: {
            d.aoiError.fnError(d, "custom", {}, `There were no results found.`);
            debugResult = 'empty';
        }
        case LoadType.TRACK: {
            const track = player.buildTrack(res.data, d.author);
            if (player.queue.length > d.client.music.maxQueueSize)
                return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.music.maxQueueSize} songs`); 
            player.queue.push(track);
            await player.isPlaying();
            debugResult = 'track';
            break;
        }
        case LoadType.PLAYLIST: {
            if (res.data.tracks.length > d.client.music.maxPlaylistSize)
                return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.music.maxPlaylistSize} songs`); 
            for (const track of res.data.tracks) {
                const pl = player.buildTrack(track, d.author);
                if (player.queue.length > d.client.music.maxQueueSize)
                    return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.music.maxQueueSize} songs`); 
                player.queue.push(pl);
            }
            await player.isPlaying();
            debugResult = 'playlist';
            break;
        }
        case LoadType.SEARCH: {
            const track = player.buildTrack(res.data[0], d.author);
            if (player.queue.length > d.client.music.maxQueueSize)
                return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.music.maxQueueSize} songs`); 
            player.queue.push(track);
            await player.isPlaying();
            debugResult = 'search';
            break;
        }
        default: {
            d.aoiError.fnError(d, "custom", {}, `There was an error while searching.`);
            debugResult = 'error';
            break;
        }
    }

    if (debug && debug == 'true') data.result = (debugResult || 'unknown');
    return {
        code: d.util.setCode(data)
    }
}
