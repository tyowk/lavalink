module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const player = d.client.queue.get(d.guild.id);
  
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild.`);
    if (!player.history.length) return d.aoiError.fnError(d, "custom", {}, `There is no songs in history`.);
    
    player.previousTrack();
  
    return {
        code: d.util.setCode(data)
    }
};
