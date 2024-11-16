module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [value] = data.inside.splits;
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    if (player.paused) { player.pause() }
    else { return d.aoiError.fnError(d, "custom", {}, `The player is not paused.`) }
  
    return {
        code: d.util.setCode(data)
    }
}
