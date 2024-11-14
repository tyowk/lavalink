module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    if (player.queue.length === 0) return;
    player.skip();
  
    return {
        code: d.util.setCode(data)
    }
};
