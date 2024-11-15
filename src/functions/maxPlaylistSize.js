module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [value] = data.inside.splits;
    
    if (!value) {
        data.result = d.client.music.maxPlaylistSize || 100;
    } else {
        if (isNaN(value)) return d.aoiError.fnError(d, "custom", {}, `Please provide a valid number.`);
        if (value < 1) return d.aoiError.fnError(d, "custom", {}, `The maximum playlist size can't be lower than 1.`);
        d.client.music.maxPlaylistSize = isNaN(value) ? 100 : value;
    }
  
    return {
        code: d.util.setCode(data)
    }
}
