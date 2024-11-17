module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const [ page = 1,
            limit = 10,
            format = '{position}. {title} | {requester.username}',
            separator = '\n'
          ] = data.inside.splits;
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    const queue = player.queue.map((track, index) => {
        return format
            .replaceAll('{position}', index + 1)
            .replaceAll('{title}', track.info.title)
            .replaceAll('{requester.username}', track.info.requester.username)
            .replaceAll('{requester.globalName}', track.info.requester.globalName)
            .replaceAll('{requester.id}', track.info.requester.id)
            .replaceAll('{requester.avatar}', track.info.requester.avatar)
            .replaceAll('{requester.banner}', track.info.requester.banner)
            .replaceAll('{requester.mention}', `<@${track.info.requester.id}>`)
            .replaceAll('{artwork}', track.info.artworkUrl)
            .replaceAll('{url}', track.info.uri)
            .replaceAll('{uri}', track.info.uri)
            .replaceAll('{duration}', d.client.utils.formatTime(track.info.length))
            .replaceAll('{author}', track.info.author)
            .replaceAll('{artist}', track.info.author)
            .replaceAll('{source}', track.info.sourceName)
            .replaceAll('{identifier}', track.info.identifier)
            .replaceAll('{isSeekable}', track.info.isSeekable ? 'Yes' : 'No')
            .replaceAll('{isStream}', track.info.isStream ? 'Yes' : 'No')
            .replaceAll('{isrc}', track.info.isrc || 'N/A')
            .replaceAll('{durationMs}', track.info.length || 'N/A')
            .replaceAll('{queueLength}', player.queue.length || 'N/A');
    });

    let chunks = d.client.utils.chunk(queue, limit);
    if (chunks.length === 0) chunks = [[]];
    if (page < 1 || page > chunks.length)  return d.aoiError.fnError(d, "custom", {}, `Invalid page number!`);
    const pages = chunks.map(chunk => chunk.join(separator));

    data.result = pages[page - 1];

    return {
        code: d.util.setCode(data)
    };
};
