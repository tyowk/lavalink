module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [type, index, guildId] = data.inside.splits;
    if (!type) type = 'title';
    type = type.split('.');
    
    let player = d.client.queue.get(guildId ? guildId : d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    if (index && !isNaN(index) && index > 0) {
        const res = player.queue[(index - 1)]?.info;
        if (res) {
            if (type[0] === 'requester') {
                data.result = res.requester[type[1]];
            } else {
                data.result = res[type[0]];
            }
        }
    } else {
        const res = player.current.info;
        if (!res) return d.aoiError.fnError(d, "custom", {}, `There is no song currently playing.`);
        if (type[0] === 'requester') {
            data.result = res.requester[type[1]];
        } else {
            data.result = res[type[0]];
        }
    }

    return {
        code: d.util.setCode(data)
    };
};
