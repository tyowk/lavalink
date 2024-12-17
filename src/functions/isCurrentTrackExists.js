module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const [guildId] = data.inside.splits;

    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
  
    const player = d.client.queue.get(guildId ? guildId : d.guild.id);
    data.result = player?.current ? true : false;
    
    return {
        code: d.util.setCode(data)
    }
}
