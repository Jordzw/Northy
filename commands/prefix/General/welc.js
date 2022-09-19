const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "welc",
  description: "Replies with pong!",
  permissions: ["SendMessages"],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    const mbr = message.mentions.members.first();
    client.emit("guildMemberAdd", mbr);
  },
};
