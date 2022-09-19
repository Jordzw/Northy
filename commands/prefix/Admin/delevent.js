const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "delevent",
  description: "Set the prefix for the guild.",
  usage: "prefix [new prefix]",
  permissions: ["Administrator"],
  owner: true,
  run: async (client, message, args) => {
    if (isNan(args[0])) {
      message.guild.channels.cache.forEach((item) => {
        if (item.parentId == "973474379117768714") {
          item.delete();
        }
      });
    }
  },
};
