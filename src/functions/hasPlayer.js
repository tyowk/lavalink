module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    data.result = d.client.queue.get(d.guild.id) ? true : false;
    return {
        code: d.util.setCode(data)
    }
}
