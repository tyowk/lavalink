module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [time] = data.inside.splits;
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild.`);

    if (!player.current) return d.aoiError.fnError(d, "custom", {}, `There is no songs currently playing.`);
    if (!player.current?.info.isSeekable) return d.aoiError.fnError(d, "custom", {}, `This current track is not seekable.`);
    time = d.client.utils.parseTime(time?.addBrackets());
    if (!time) return d.aoiError.fnError(d, "custom", {}, `Invalid time format.`);
    
    player.seek(time);
  
    return {
        code: d.util.setCode(data)
    }
};
