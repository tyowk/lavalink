module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const player = d.client.queue.get(d.guild.id);
    data.result = player.queue?.length || 0;
    return {
        code: d.util.setCode(data)
    }
}
