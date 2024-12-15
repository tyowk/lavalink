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
    if (!query) return d.aoiError.fnError(d, "custom", {}, `Please provide the title of the song you want to search.`);
    type = type?.toLowerCase()
        .replace('youtube', 'ytsearch')
        .replace('spotify', 'spsearch')
        .replace('soundcloud', 'scsearch')
        .replace('deezer', 'dzsearch')
        .replace('youtubemusic', 'ytmsearch')
        .replace('applemusic', 'amsearch');

    const player = d.client.queue.get(d.guild.id);
    const res = (player && player?.responses && player?.responses?.query === query?.addBrackets())
        ? player?.responses
        : await d.client.queue.search(query?.addBrackets(), type);
    
    setTimeout(() => {
        if (player?.responses)
            player.responses = null;
    }, 5000);
    
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
                const replace = {
                    position: index + 1,
                    encoded: track.encoded,
                    title: trackInfo.title,
                    artwork: trackInfo.artworkUrl,
                    url: trackInfo.uri,
                    uri: trackInfo.uri,
                    duration: d.client.music.utils.formatTime(trackInfo.length),
                    author: trackInfo.author,
                    artist: trackInfo.author,
                    source: trackInfo.sourceName,
                    identifier: trackInfo.identifier,
                    isSeekable: trackInfo.isSeekable ? 'Yes' : 'No',
                    isStream: trackInfo.isStream ? 'Yes' : 'No',
                    isrc: trackInfo.isrc || 'N/A',
                    durationMs: trackInfo.length || 'N/A'
                };

                return Object.entries(replace).reduce((formatted, [key, value]) => {
                    return formatted.replaceAll(`{${key}}`, value);
                }, format);
            });

            let chunks = d.client.music.utils.chunk(result, Number(limit));
            if (chunks.length === 0) chunks = [[]];
            let pages = chunks.map(chunk => chunk.join(separator));
    
            data.result = pages[page - 1];
            break;
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
