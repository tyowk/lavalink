const { LoadType } = require('shoukaku');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [query, type] = data.inside.splits;
    if (!query) return d.aoiError.fnError(d, "custom", {}, `Please provide the title or link of the song you want to play!`);




    let player = d.client.queue.get(d.guild.id);
    const vc = d.member;
    if (!player)
       player = await d.client.queue.create(
           ctx.guild,
           vc.voice.channel,
           ctx.channel
       );
    const res = await this.client.queue.search(query);
    const embed = this.client.embed();
    switch (res.loadType) {
      case LoadType.ERROR:
        ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.red)
              .setDescription("There was an error while searching."),
          ],
        });
        break;
      case LoadType.EMPTY:
        ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.red)
              .setDescription("There were no results found."),
          ],
        });
        break;
      case LoadType.TRACK: {
        const track = player.buildTrack(res.data, ctx.author);
        if (player.queue.length > client.config.maxQueueSize)
          return await ctx.sendMessage({
            embeds: [
              embed
                .setColor(this.client.color.red)
                .setDescription(
                  `The queue is too long. The maximum length is ${client.config.maxQueueSize} songs.`
                ),
            ],
          });
        player.queue.push(track);
        await player.isPlaying();
        ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.main)
              .setDescription(
                `Added [${res.data.info.title}](${res.data.info.uri}) to the queue.`
              ),
          ],
        });
        break;
      }
      case LoadType.PLAYLIST: {
        if (res.data.tracks.length > client.config.maxPlaylistSize)
          return await ctx.sendMessage({
            embeds: [
              embed
                .setColor(this.client.color.red)
                .setDescription(
                  `The playlist is too long. The maximum length is ${client.config.maxPlaylistSize} songs.`
                ),
            ],
          });
        for (const track of res.data.tracks) {
          const pl = player.buildTrack(track, ctx.author);
          if (player.queue.length > client.config.maxQueueSize)
            return await ctx.sendMessage({
              embeds: [
                embed
                  .setColor(this.client.color.red)
                  .setDescription(
                    `The queue is too long. The maximum length is ${client.config.maxQueueSize} songs.`
                  ),
              ],
            });
          player.queue.push(pl);
        }
        await player.isPlaying();
        ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.main)
              .setDescription(
                `Added ${res.data.tracks.length} songs to the queue.`
              ),
          ],
        });
        break;
      }
      case LoadType.SEARCH: {
        const track1 = player.buildTrack(res.data[0], ctx.author);
        if (player.queue.length > client.config.maxQueueSize)
          return await ctx.sendMessage({
            embeds: [
              embed
                .setColor(this.client.color.red)
                .setDescription(
                  `The queue is too long. The maximum length is ${client.config.maxQueueSize} songs.`
                ),
            ],
          });
        player.queue.push(track1);
        await player.isPlaying();
        ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.main)
              .setDescription(
                `Added [${res.data[0].info.title}](${res.data[0].info.uri}) to the queue.`
              ),
          ],
        });
        break;
      }
    }


    
    return {
        code: d.util.setCode(data)
    }
}
