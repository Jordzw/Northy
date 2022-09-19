const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "bio",
  type: 1,
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: "" // User permissions needed
},
  description: "Change ta bio",
  options: [
    {
      name: "bio",
      description: "Que voulez vous mettre comme bio ?",
      type: 3,
      required: true,
    },
  ],
  run: async ({ client, interaction, guildData, memberData }) => {
    const bio = interaction.options.getString("bio");

    if (bio) {
      const embBioSuc = new EmbedBuilder()
        .setTitle(interaction.user.username + " a changé sa bio")
        .setDescription(
          "**Ancienne:** " + memberData.bio + "\n**Nouvelle:** " + bio
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setColor(client.config.Color.success);

      await interaction.reply({ embeds: [embBioSuc], ephemeral: true });

      memberData.bio = bio;
      await memberData.save();
    }
  },
};
