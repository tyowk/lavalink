module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    let [type, index] = data.inside.splits;
    if (!type) type = 'title';
    type = type?.split('.') || [];

    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild.`);

    const getResult = (res) => {
        if (!res) return null;
        if (type[0] === 'requester') {
            return res.requester?.[type[1]];
        } else if (type[0] === 'plugininfo') {
            return res.plugininfo?.[type[1]];
        } else if (type[0] === 'userdata') {
            return res.userdata?.[type[1]];
        } else {
            return res[type[0]];
        }
    };

    if (index && !isNaN(index) && index > 0) {
        const res = player.queue[(index - 1)]?.info;
        data.result = getResult(res);
    } else {
        const res = player.current?.info;
        if (!res) return d.aoiError.fnError(d, "custom", {}, `There is no song currently playing.`);
        data.result = getResult(res);
    }

    return {
        code: d.util.setCode(data)
    };
};
