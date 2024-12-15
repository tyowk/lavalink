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
