module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [guildId] = data.inside.splits;
    data.result = (d.client.queue.get(guildId ? guildId : d.guild.id)) ? true : false;
    return {
        code: d.util.setCode(data)
    }
}
