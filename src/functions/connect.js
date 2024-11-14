module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    
    let player = d.client.queue.get(d.guild.id);
    if (player) player.destroy();
  
    player = await d.client.queue.create(
        d.guild,
        d.member?.voice?.channel,
        d.channel,
        d.client.shoukaku.options.nodeResolver(d.client.shoukaku.nodes);
    );
  
    return {
        code: d.util.setCode(data)
    }
}
