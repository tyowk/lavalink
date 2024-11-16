module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [value] = data.inside.splits;
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    data.result = player.loop;
  
    return {
        code: d.util.setCode(data)
    }
}
