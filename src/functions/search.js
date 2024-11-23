const { LoadType } = require('shoukaku');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [query,
         type = d.client.music.searchEngine,
         format = '{position}. {title} by {artist}',
         list = 10,
         separator = '\n'
        ] = data.inside.splits;

    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    
    if (!query) return d.aoiError.fnError(d, "custom", {}, `Please provide the title of the song you want to search.`);
    type = type?.toLowerCase()
        .replace('youtube', 'ytsearch')
        .replace('spotify', 'spsearch')
        .replace('soundcloud', 'scsearch')
        .replace('deezer', 'dzsearch')
        .replace('youtubemusic', 'ytmsearch');

    const res = await d.client.queue.search(query?.addBrackets(), type);
    const maxQueueSize = Number(d.client.music.maxQueueSize) || 100;
    const maxPlaylistSize = Number(d.client.music.maxPlaylistSize) || 100;

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
            if (player.queue.length >= maxQueueSize) {
                d.aoiError.fnError(d, "custom", {}, `The queue length is too long. The maximum length is ${maxQueueSize} songs.`);
                break;
            };
            debugResult = 'track';
            const track = player.buildTrack(res.data, d.author);
            player.queue.push(track);
            await player.isPlaying();
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
            await player.isPlaying();
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



module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const [
        page = 1,
        limit = 10,
        format = '{position}. {title} | {requester.username}',
        separator = '\n'
    ] = data.inside.splits;

    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild.`);
    if (!player.queue.length) return d.aoiError.fnError(d, "custom", {}, `There is no songs in the queue.`);
    if (isNaN(Number(page)) || isNaN(Number(limit))) return d.aoiError.fnError(d, "custom", {}, `Please provide a valid number.`);
    
    const queue = player.queue.map((track, index) => {
        const trackInfo = track.info;
        const requester = trackInfo.requester;
        const replace = {
            position: index + 1,
            title: trackInfo.title,
            artwork: trackInfo.artworkUrl,
            url: trackInfo.url,
            uri: trackInfo.uri,
            duration: d.client.music.utils.formatTime(trackInfo.length),
            author: trackInfo.author,
            artist: trackInfo.artist,
            source: trackInfo.sourceName,
            identifier: trackInfo.identifier,
            isSeekable: trackInfo.isSeekable ? 'Yes' : 'No',
            isStream: trackInfo.isStream ? 'Yes' : 'No',
            isrc: trackInfo.isrc || 'N/A',
            durationMs: trackInfo.length || 'N/A',
            queueLength: player.queue.length || 'N/A',
            'requester.username': requester.username,
            'requester.globalName': requester.globalName,
            'requester.id': requester.id,
            'requester.avatar': requester.avatar,
            'requester.banner': requester.banner,
            'requester.mention': `<@${requester.id}>`
        };

        return Object.entries(replace).reduce((formatted, [key, value]) => {
            return formatted.replaceAll(`{${key}}`, value);
        }, format);
    });

    let chunks = d.client.music.utils.chunk(queue, Number(limit));
    if (chunks.length === 0) chunks = [[]];
    if (Number(page) < 1 || Number(page) > chunks.length) return d.aoiError.fnError(d, "custom", {}, `Invalid page number.`);
    let pages = chunks.map(chunk => chunk.join(separator));
    
    data.result = pages[page - 1];

    return {
        code: d.util.setCode(data)
    };
};
