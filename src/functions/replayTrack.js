    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild.`);

    if (!player.current) return d.aoiError.fnError(d, "custom", {}, `There is no song currently playing.`);
    if (!player.current?.info.isSeekable) return d.aoiError.fnError(d, "custom", {}, `This current track is cannot be replayed.`);
    
    player.seek(0);
  
    return {
        code: d.util.setCode(data)
    }
};
