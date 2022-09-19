const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  type: 1,
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: "" // User permissions needed
},
  description: "Return websocket ping",
  cooldown: 5000,
  run: async ({ client, interaction, guildData }) => {
    
    interaction.reply({ embeds: [
      new EmbedBuilder()
        .setColor(guildData.config.color.main)
        .setDescription(`${client.ws.ping} ms!`)
    ] })
    
  },  
};
