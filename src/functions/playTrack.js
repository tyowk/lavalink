const { LoadType } = require('shoukaku');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [query, type] = data.inside.splits;
    if (!query) return d.aoiError.fnError(d, "custom", {}, `Please provide the title or link of the song you want to play!`);
    if (!type) type = 'youtube';
    type = type?.toLowerCase()?.replace('youtube', 'ytsearch')?.replace('spotify', 'spsearch')?.replace('soundcloud', 'scsearch');

    let player = d.client.queue.get(d.guild.id);
    if (!player)
       player = await d.client.queue.create(
           d.guild,
           d.member?.voice?.channel,
           d.channel
       );
    
    const res = await d.client.queue.search(query, type);
    switch (res.loadType) {
        case LoadType.ERROR: return d.aoiError.fnError(d, "custom", {}, `There was an error while searching.`);
        case LoadType.EMPTY: return d.aoiError.fnError(d, "custom", {}, `There were no results found.`);
        case LoadType.TRACK: {
            const track = player.buildTrack(res.data, d.author);
            if (player.queue.length > d.client.musicOptions.maxQueueSize)
                return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.musicOptions.maxQueueSize} songs`); 
            player.queue.push(track);
            await player.isPlaying();
            break;
        }
        case LoadType.PLAYLIST: {
            if (res.data.tracks.length > d.client.musicOptions.maxPlaylistSize)
                return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.musicOptions.maxPlaylistSize} songs`); 
            for (const track of res.data.tracks) {
                const pl = player.buildTrack(track, d.author);
                if (player.queue.length > d.client.musicOptions.maxQueueSize)
                    return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.musicOptions.maxQueueSize} songs`); 
                player.queue.push(pl);
            }
            await player.isPlaying();
            break;
        }
        case LoadType.SEARCH: {
            const track = player.buildTrack(res.data[0], d.author);
            if (player.queue.length > d.client.musicOptions.maxQueueSize)
                return d.aoiError.fnError(d, "custom", {}, `The queue length is to long. The maximum length is ${d.client.musicOptions.maxQueueSize} songs`); 
            player.queue.push(track);
            await player.isPlaying();
            break;
        }
    }
    
    return {
        code: d.util.setCode(data)
    }
}
