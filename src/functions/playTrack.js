module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [query, type] = data.inside.splits;
    if (!query) return d.aoiError.fnError(d, "custom", {}, `Please provide the title or link of the song you want to play!`);






    
    return {
        code: d.util.setCode(data)
    }
}
