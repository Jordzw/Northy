const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "bot",
  type: 1,
  description: "Bot info",
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: "" // User permissions needed
},
  owner: true,
  cooldown: 5000,
  run: async ({ client, interaction, guildData }) => {
    
    const embed = new EmbedBuilder()
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
    .setColor(guildData.config.color.main)
    .setURL('https://github.com/FnrDev/slash-commands')
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      {
        name: 'Total Servers:',
        value: `${client.guilds.cache.size} Guilds`,
        inline: true,
      },
      {
        name: 'Total Users:',
        value: `${client.users.cache.size} Users`,
        inline: true,
      },
      {
        name: 'Total Channels:',
        value: `${client.channels.cache.size} Channels`,
        inline: true,
      },
      {
        name: 'Obtiens-moi ici:',
        value: `[Link](https://github.com/FnrDev/slash-commands)`,
        inline: true,
      },
    );
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setStyle(ButtonStyle.Link).setURL('https://github.com/FnrDev/slash-commands').setLabel('Click Me'),
  );
  interaction.reply({ embeds: [embed], components: [row] });
    
  },  
};
