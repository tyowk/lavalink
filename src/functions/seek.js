module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [time] = data.inside.splits;
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);

    time = d.client.utils.parseTime(time?.addBrackets());
    if (!time) return d.aoiError.fnError(d, "custom", {}, `Invalid time format.`);
    
    player.seek(time);
  
    return {
        code: d.util.setCode(data)
    }
};
