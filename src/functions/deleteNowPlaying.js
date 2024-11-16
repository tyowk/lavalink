module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    const msg = player.nowPlayingMessage;
    if (!msg) return d.aoiError.fnError(d, "custom", {}, `Invalid message, please make sure the message is exists.`);
    if (!msg.deletable || msg.author.id !== d.client.user.id) return d.aoiError.fnError(d, "custom", {}, `Invalid message, please make sure the message is deletable and sended by the bot.`);
    await msg.delete().catch(() => {});
    
    return {
        code: d.util.setCode(data)
    }
}
