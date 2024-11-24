const { Filters } = require('../classes/Filters');

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let [value, custom] = data.inside.splits;

    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    
    const player = d.client.queue.get(d.guild.id);
    if (!player)  return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild.`);
    if (!value) return d.aoiError.fnError(d, "custom", {}, `Invalid filter name.`);
    
    if (value === 'custom') {
        if (!custom)  return d.aoiError.fnError(d, "custom", {}, `Please provide a valid custom filter.`);
        custom = JSON.parse(custom);
        player.player?.update({
            filters: custom
        }, true);
        player.filters.push('custom');
    } else {
        const filter = Filters[value];
        if (!filter) return d.aoiError.fnError(d, "custom", {}, `Invalid filter provided: "${value}".`);
        player.player?.update({
            filters: filter
        }, true);
        player.filters.push(value);
    }

    return {
        code: d.util.setCode(data)
    };
};
