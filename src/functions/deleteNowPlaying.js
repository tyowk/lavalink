module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    const msg = player.nowPlayingMessage;
    if (!msg || !msg.deletable || !msg.author.id) return d.aoiError.fnError(d, "custom", {}, `Invalid message, please make sure the message is deletable and sended by the bot.`);
    msg.delete().catch();
    
    return {
        code: d.util.setCode(data)
    }
}
