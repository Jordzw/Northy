const {
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "captcha",
  description: "Configure l'addons Captcha",
  type: 1,
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.KickMembers, // User permissions needed
},
  cooldown: 5000,
  category: "captcha",
  options: [
    {
      name: "setup",
      description: "Configure l'addons Captcha",
      type: 1,
      options: [
        {
          name: "channel",
          description: "Dans quel channel sera le Captcha",
          required: true,
          type: 7,
          channel_types: ["0"],
        },
        {
          name: "essais",
          description: "Combien d'essai voulez vous laisser ?",
          type: 4,
          required: true,
        },
        {
          name: "role",
          description: "Role à obtenir après la reussite du captcha",
          type: 8,
          required: true
        }
      ],
    },
  ],

  run: async ({ client, interaction, guildData }) => {
    if (interaction.options._subcommand == "setup") {
      const channel = await interaction.options.getChannel("channel");
      const role = await interaction.options.getRole("role");
      const attempts = await interaction.options.getInteger("essais");

      if(!guildData.addons.captcha.enabled){
        guildData.addons.captcha.enabled = true;
      }

      guildData.addons.captcha.channel = channel.id;
      guildData.addons.captcha.registerRole = role.id;
      guildData.addons.captcha.attempts = attempts;


      guildData.markModified("addons.captcha");
      await guildData.save();
    }
  },
};
