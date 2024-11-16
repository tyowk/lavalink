module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [value, type] = data.inside.splits;
    type = type ? type : d.client.music.searchEngine;
    const player = d.client.queue.get(d.guild.id);
    
    if (!value) {
        data.result = player.autoplay || false;
    } else {
        if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild!`);
        if (!player.current) return d.aoiError.fnError(d, "custom", {}, `There is no song currently playing.`);
        await player.setAutoplay((value && value == 'true') ? true : false, type);
    }
  
    return {
        code: d.util.setCode(data)
    }
}
