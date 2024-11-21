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
        .replace('youtubemusic', 'ytmsearch');

    if (!d.member?.voice?.channel) return d.aoiError.fnError(d, "custom", {}, `You are not connected to any voice channels.`);
    let player = d.client.queue.get(d.guild.id);
    if (!player)
       player = await d.client.queue.create(
           d.guild,
           d.member?.voice?.channel,
           d.channel
       );

    let debugResult;
    const res = await d.client.queue.search(query?.addBrackets(), type);
    switch (res?.loadType) {
        case LoadType.ERROR: {
            debugResult = 'error';
            d.aoiError.fnError(d, "custom", {}, `There was an error while searching.`);
            break;
        }
        case LoadType.EMPTY: {
            debugResult = 'empty';
            d.aoiError.fnError(d, "custom", {}, `There were no results found.`);
            break;
        }
        case LoadType.TRACK: {
            debugResult = 'track';
            const track = player.buildTrack(res.data, d.author);
            if (player.queue.length > Number(d.client.music.maxQueueSize)) return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.music.maxQueueSize} songs.`); 
            player.queue.push(track);
            await player.isPlaying();
            break;
        }
        case LoadType.PLAYLIST: {
            debugResult = 'playlist';
            if (res.data.tracks.length > Number(d.client.music.maxPlaylistSize)) return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.music.maxPlaylistSize} songs.`); 
            for (const track of res.data.tracks) {
                const pl = player.buildTrack(track, d.author);
                if (player.queue.length > d.client.music.maxQueueSize) return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.music.maxQueueSize} songs.`); 
                player.queue.push(pl);
            }
            await player.isPlaying();
            break;
        }
        case LoadType.SEARCH: {
            debugResult = 'search';
            if (res.data === []) return d.aoiError.fnError(d, "custom", {}, `There were no results found.`);
            const track = player.buildTrack(res.data[0], d.author);
            if (player.queue.length > Number(d.client.music.maxQueueSize)) return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.music.maxQueueSize} songs.`); 
            player.queue.push(track);
            await player.isPlaying();
            break;
        }
        default: {
            debugResult = 'error';
            d.aoiError.fnError(d, "custom", {}, `There was an error while searching.`);
            break;
        }
    }

    if (debug && debug == 'true') data.result = debugResult;
    return {
        code: d.util.setCode(data)
    }
}
