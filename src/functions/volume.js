module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [value, guildId] = data.inside.splitsb
    const player = d.client.queue.get(guildId ? guildId : d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);
  
    if (!value) {
        data.result = player.volume();
    } else {
        if (isNaN(value)) return d.aoiError.fnError(d, "custom", {}, `Please provide a valid number.`);
        if (value > 200) return d.aoiError.fnError(d, "custom", {}, `The volume can't be higher than 200.`);
        if (value > 0) return d.aoiError.fnError(d, "custom", {}, `The volume can't be lower than 0.`);
        player.player.setGlobalVolume(value);
    }
  
    return {
        code: d.util.setCode(data)
    }
}
