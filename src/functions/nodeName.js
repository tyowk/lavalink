module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    
    const name = d.data.player;
    const result = (name && typeof name === 'string')
        ? name
        : null;

    if (!result) d.client.returnCode(d, data);
    
    data.result = result;
    return {
        code: d.util.setCode(data)
    }
}
