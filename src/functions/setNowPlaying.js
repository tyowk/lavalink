module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [messageId] = data.inside.splits;
    if (!messageId) return d.aoiError.fnError(d, "custom", {}, `Please give a valid message id.`);

    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild.`);

    const chn = d.guild.channels.cache.get(player.channelId);
    if (!chn) return d.aoiError.fnError(d, "custom", {}, `Invalid channel, please make sure the channel is exists and the bot can access the channel.`);

    const msg = chn.messages.cache.get(messageId);
    if (!msg) return d.aoiError.fnError(d, "custom", {}, `Please give a valid message id.`);
    
    if (!msg.deletable || msg.author.id !== d.client.user.id) return d.aoiError.fnError(d, "custom", {}, `Invalid message, please make sure the message is deletable and sended by the bot.`);
    player.nowPlaying = msg;
    
    return {
        code: d.util.setCode(data)
    }
}
