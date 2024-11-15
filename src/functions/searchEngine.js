module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [value] = data.inside.splits;
    
    if (!value) {
        data.result = d.client.music.searchEngine || 'ytsearch';
    } else {
        if (value && typeof value !== 'string') return d.aoiError.fnError(d, "custom", {}, `The type of value must be a string.`);
        d.client.music.searchEngine = value || 'ytsearch';
    }
  
    return {
        code: d.util.setCode(data)
    }
}
