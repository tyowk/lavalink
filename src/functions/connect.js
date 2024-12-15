const { ChannelType } = require('discord.js');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [voiceId] = data.inside.splits;

    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    
    if (!voiceId) voiceId = d.member?.voice?.channel?.id;
    if (!voiceId) return d.aoiError.fnError(d, "custom", {}, `You are not connected to any voice channels.`);
    const voiceChannel = await d.guild.channels.fetch(voiceId);
    if (voiceChannel.type !== ChannelType.GuildVoice && voiceChannel.type !== ChannelType.GuildStageVoice)
        return d.aoiError.fnError(d, "custom", {}, `Invalid channel type: ${voiceChannel.type}, must be voice or stage channel.`);
    
    let player = d.client.queue.get(d.guild.id);
    if (player) player.destroy();
  
    player = await d.client.queue.create(
        d.guild,
        voiceChannel,
        d.channel,
        d.client.shoukaku.options.nodeResolver(d.client.shoukaku.nodes)
    );
  
    return {
        code: d.util.setCode(data)
    };
};
