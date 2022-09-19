const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "delrole",
  description: "Set the prefix for the guild.",
  usage: "prefix [new prefix]",
  permissions: ["Administrator"],
  owner: true,
  run: async (client, message, args, prefix, config) => {
    message.guild.roles.cache.forEach((item) => {
      item.delete();
    });
  },
};
