const { LoadType } = require('shoukaku');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [query, type] = data.inside.splits;

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

    const player = d.client.queue.get(d.guild.id)
    const res = (player && player?.responses && (player?.responses?.query === query.addBrackets()))
        ? player.responses
        : await d.client.queue.search(query?.addBrackets(), type);
    
    if (player) {
        player.responses = res || null;
        if (player.responses && typeof player.responses === 'object') player.responses.query = query.addBrackets();
    };
    
    switch (res?.loadType) {
        case LoadType.TRACK:
            data.result = 'track';
            break;
        case LoadType.PLAYLIST:
            data.result = 'playlist';
            break;
        case LoadType.SEARCH:
            data.result = 'search';
            break;
        default:
            data.result = 'error';
    };
    
    return {
        code: d.util.setCode(data)
    }
}
