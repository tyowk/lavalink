




if (!player.queue.length)
      return await ctx.sendMessage({
        embeds: [
          embed
            .setColor(this.client.color.red)
            .setDescription("There are no songs in the queue."),
        ],
      });
    if (isNaN(Number(args[0])))
      return await ctx.sendMessage({
        embeds: [
          embed
            .setColor(this.client.color.red)
            .setDescription("That is not a valid number."),
        ],
      });
    if (Number(args[0]) > player.queue.length)
      return await ctx.sendMessage({
        embeds: [
          embed
            .setColor(this.client.color.red)
            .setDescription("That is not a valid number."),
        ],
      });
    if (Number(args[0]) < 1)
      return await ctx.sendMessage({
        embeds: [
          embed
            .setColor(this.client.color.red)
            .setDescription("That is not a valid number."),
        ],
      });
    player.remove(Number(args[0]) - 1);
    return await ctx.sendMessage({
      embeds: [
        embed
          .setColor(this.client.color.main)
          .setDescription(
            `Removed song number ${Number(args[0])} from the queue`
          ),
      ],
    });
