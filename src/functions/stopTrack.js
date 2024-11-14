module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [guildId] = data.inside.splits;
    const player = d.client.queue.get(guildId ? guildId : d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);
    if (!player.current) return d.aoiError.fnError(d, "custom", {}, `There is no song currently playing.`);
    
    player.queue = [];
    player.stop();
  
    return {
        code: d.util.setCode(data)
    }
}
