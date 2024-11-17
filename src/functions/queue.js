module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const [index] = data.inside.splits;
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    const queue = player.queue.map((track, index) => {
        return `${index + 1}. [${track.info.title}](${track.info.uri}) - Request By: ${track?.info.requester} - Duration: ${track.info.isStream ? "LIVE" : d.client.utils.formatTime(track.info.length)}`;
    });

    let chunks = d.client.utils.chunk(queue, 10);
    if (chunks.length === 0) chunks = [[]]; 

    if (index < 1 || index > chunks.length) return d.aoiError.fnError(d, "custom", {}, `Invalid page number!`);
    const pages = chunks.map(chunk => chunk.join('\n'));

    data.result = pages[index - 1];

    return {
        code: d.util.setCode(data)
    };
};
