const {
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "party",
  type: 1,
  description: "Supprime le nombre de message demandé",
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.KickMembers, // User permissions needed
},
  cooldown: 5000,
  category: "party",
  options: [
    {
      name: "setup",
      description: "Configure l'addons pour les soirées",
      type: 1,
      options: [
        {
          name: "category",
          description: "Dans quelle catégorie voulez vous que les soirées se créer",
          required: true,
          type: 7,
          channel_types: ["4"],
        },
        {
          name: "role",
          description: "Quel rôle souhaite tu @ lors des annonces",
          type: 8,
        }
      ],
    },
  ],

  run: async ({ client, interaction, guildData }) => {
    if (interaction.options._subcommand == "setup") {
      const cat = await interaction.options.getChannel("category");
      const role = await interaction.options.getRole("role");

      if(!guildData.addons.party.enabled){
        guildData.addons.party.enabled = true;
      }

      guildData.addons.party.category = cat.id;

      if(role){
      guildData.addons.party.roleTag = role.id;
      }

      guildData.markModified("addons.party");
      await guildData.save();
    }
  },
};
