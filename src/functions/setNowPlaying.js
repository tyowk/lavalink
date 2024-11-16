module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [messageId] = data.inside.splits;
    if (!messageId) return d.aoiError.fnError(d, "custom", {}, `Please give a valid message id.`);
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    const chn = await d.guild.channels.cache.get(player.channelId);
    const msg = await chn.messages.cache.get(messageId);
    if (!msg) return d.aoiError.fnError(d, "custom", {}, `Please give a valid message id.`);
    
  
    return {
        code: d.util.setCode(data)
    }
}
