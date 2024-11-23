const { LoadType } = require('shoukaku');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [query,
         type = d.client.music.searchEngine,
         format = '{position}. {title} | {artist}',
         limit = 10,
         separator = '\n',
         page = 1
        ] = data.inside.splits;

    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    const player = d.client.queue.get(d.guild.id);
    if (!query) return d.aoiError.fnError(d, "custom", {}, `Please provide the title of the song you want to search.`);
    type = type?.toLowerCase()
        .replace('youtube', 'ytsearch')
        .replace('spotify', 'spsearch')
        .replace('soundcloud', 'scsearch')
        .replace('deezer', 'dzsearch')
        .replace('youtubemusic', 'ytmsearch');

    const res = await d.client.queue.search(query?.addBrackets(), type);
    switch (res?.loadType) {
        case LoadType.ERROR: {
            d.aoiError.fnError(d, "custom", {}, `There was an error while searching.`);
            break;
        }
        case LoadType.EMPTY: {
            d.aoiError.fnError(d, "custom", {}, `There were no results found.`);
            break;
        }
        case LoadType.TRACK: {
            d.aoiError.fnError(d, "custom", {}, `Invalid load type "TRACK"`);
            break;
        }
        case LoadType.PLAYLIST: {
            d.aoiError.fnError(d, "custom", {}, `Invalid load type "PLAYLIST"`);
            break;
        }
        case LoadType.SEARCH: {
            if (!Array.isArray(res.data) || res.data.length === 0)
                return d.aoiError.fnError(d, "custom", {}, `There were no results found.`);

            const result = res.data.map((track, index) => {
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
                    queueLength: player?.queue?.length || 'N/A',
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

            let chunks = d.client.music.utils.chunk(result, Number(limit));
            if (chunks.length === 0) chunks = [[]];
            let pages = chunks.map(chunk => chunk.join(separator));
    
            data.result = pages[page - 1]
        }
        default: {
            d.aoiError.fnError(d, "custom", {}, `There was an error while searching.`);
            break;
        }
    }

    return {
        code: d.util.setCode(data)
    }
}
