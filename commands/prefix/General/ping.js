const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Replies with pong!",
  permissions: ["SendMessages"],
  owner: false,
  cooldown: 30000,
  run: async (client, message, args, prefix, config, db) => {
    // message.reply({ embeds: [
    //   new EmbedBuilder()
    //     .setDescription(`🏓 **Pong!** Client websocket ping: \`${client.ws.ping}\` ms.`)
    //     .setColor("Green")
    // ] })
  },
};
