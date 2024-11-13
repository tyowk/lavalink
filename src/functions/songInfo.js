module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [query] = data.inside.splits;
    if (!query) query = 'all';

    let player = d.client.queue.get(d.guild.id);
    if (!player)
       return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);
    const type = query.split('.');
    const res = player.current.info;
    if (!res)
        return d.aoiError.fnError(d, "custom", {}, `There is no song are playing.`);
    
    if (type[0] === 'requester') {
        result = res.requester[type[1]];;
        data.result = result || 'undefined';
    } else {
        const result = res[type]
        data.result = result || 'undefined';
    }
    
    return {
        code: d.util.setCode(data)
    }
}
