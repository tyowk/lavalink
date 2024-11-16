module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.aoiError
    const [messageId] = data.inside.splits;
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    if (!value) {
        data.result = player.autoplay;
    } else {
        player.autoplay = (value && value == 'true') ? true : false;
    }
  
    return {
        code: d.util.setCode(data)
    }
}
