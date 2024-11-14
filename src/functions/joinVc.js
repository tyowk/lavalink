module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [voiceId] = data.inside.splits;
    if (!voiceId) voiceId = d.member?.voice?.channel?.id;
    const vc = d.guild.channels.fetch(voiceId);
  
    let player = d.client.queue.get(d.guild.id);
    if (player) player.destroy();
  
    player = await d.client.queue.create(
        d.guild,
        vc,
        d.channel,
        d.client.shoukaku.options.nodeResolver(d.client.shoukaku.nodes);
    );
  
    return {
        code: d.util.setCode(data)
    }
}
