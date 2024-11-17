module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const [humanize = 'false'] = data.inside.splits;
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);
    if (!player.current) return d.aoiError.fnError(d, "custom", {}, `There is no song currently playing.`);

    if (humanize == 'false') { data.result = player.player.position }
    else { data.result = d.client.utils.formatTime(player.player.position) }
  
    return {
        code: d.util.setCode(data)
    }
}
