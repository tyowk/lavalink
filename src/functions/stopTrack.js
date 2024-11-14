module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [guildId] = data.inside.splits;
  
    const player = d.client.queue.get(guildId ? guildId : d.guild.id);
    
    player.queue = [];
    player.stop();
  
    return {
        code: d.util.setCode(data)
    }
}
