module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [value] = data.inside.splitsb
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);
  
    if (!Number(value)) {
        data.result = player.volume();
    } else {
        if (isNaN(Number(value))) return d.aoiError.fnError(d, "custom", {}, `Please provide a valid number.`);
        if (Number(value) > 200) return d.aoiError.fnError(d, "custom", {}, `The volume can't be higher than 200.`);
        if (Number(value) > 0) return d.aoiError.fnError(d, "custom", {}, `The volume can't be lower than 0.`);
        player.player.setGlobalVolume(Number(value));
    }
  
    return {
        code: d.util.setCode(data)
    }
}
