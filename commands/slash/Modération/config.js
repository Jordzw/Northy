const {
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "config",
  type: 1,
  description: "Te permet de configurer le bot pour ton discord",
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.ManageChannels, // User permissions needed
},
  cooldown: 10000,
  options: [
    {
      name: "color",
      description: "Change la couleur principale",
      type: 1,
      options: [
        {
          name: "color_choice",
          type: 3,
          description:
            "Entrez le code couleur HEX (ex: #f9df04, https://htmlcolorcodes.com/)",
          required: true,
        },
      ],
    },
    {
      name: "level",
      description: "Configure l'addons level",
      type: 1,
      options: [
        {
          name: "activer",
          description:
            "Voulez vous activer le système de level pour votre discord ?",
          type: 5,
        },
        {
          name: "taux",
          description:
            "Par combien voulez vous multiplier le taux d'xp de base ?",
          type: 10,
        },
        {
          name: "notif",
          description: "Si vous souhaitez afficher les notif à chaque level up",
          type: 7,
          channel_types: ["0"],
        },
      ],
    },
    {
      name: "party",
      description: "Configure l'addons party",
      type: 1,
      options: [
        {
          name: "activer",
          description:
            "Voulez vous activer le système de party pour votre discord ?",
          type: 5,
        },
        {
          name: "category",
          description: "Dans quelle catégorie voulez vous que les soirées se créer",
          type: 7,
          channel_types: ["4"],
        },
        {
          name: "role",
          description:
            "Quel rôle souhaite tu @ lors des annonces",
          type: 8,
        },
      ],
    },
  ],
  run: async ({ client, interaction, guildData }) => {
    if (interaction.options._subcommand == "color") {
      const color = interaction.options.getString("color_choice");

      var re = /[0-9A-Fa-f]{6}/g;
      if (re.test(color)) {
        const oldColor = guildData.config.color.main;
        guildData.config.color.main = color;
        guildData.markModified("config.color");
        await guildData.save();

        const oldColEmb = new EmbedBuilder()
          .setTitle("Ancienne couleur")
          .setColor(oldColor);

        const newColEmb = new EmbedBuilder()
          .setTitle("Nouvelle couleur")
          .setColor(guildData.config.color.main);

        await interaction.reply({
          embeds: [oldColEmb, newColEmb],
          ephemeral: true,
        });
      } else {
        await client.tools
          .returnEmb({
            state: false,
            title: "Color Error",
            text: "Le code couleur donné n'est pas valide !",
          })
          .then((item) =>
            interaction.reply({ embeds: [item], ephemeral: true })
          );
      }

      // interaction.reply({
      //   embeds: [new EmbedBuilder().setDescription(`${client.ws.ping} ms!`)],
      // });
    }
    else if (interaction.options._subcommand == "level") {
      const enabled = interaction.options.getBoolean("activer");
      const taux = interaction.options.getNumber("taux");
      const channel = interaction.options.getChannel("notif");

      if (enabled && enabled != guildData.addons.level.enabled) {
        guildData.addons.level.enabled = enabled;
      }
      if (taux && taux != guildData.addons.level.taux) {
        guildData.addons.level.taux = taux;
      }
      if (channel && channel != guildData.addons.level.chNotif) {
        guildData.addons.level.chNotif = channel.id;
      } 

      const chNotif = await interaction.guild.channels.cache.get(guildData.addons.level.chNotif);

        await client.tools
          .returnEmb({
            state: true,
            title: "Config Level",
            text: `Activer: **${guildData.addons.level.enabled}**\nTaux: **${guildData.addons.level.taux}**\nChannel Notif: **${chNotif ? chNotif.name : 'Aucun'}**`,
          })
          .then((item) =>
            interaction.reply({ embeds: [item], ephemeral: true })
          );

      guildData.markModified("addons.level");
      await guildData.save();

    }
    else if (interaction.options._subcommand == "party") {
      const cat = await interaction.options.getChannel("category");
      const role = await interaction.options.getRole("role");
      const enabled = await interaction.options.getBoolean("activer");

      if(enabled && enabled != guildData.addons.party.enabled) {
        guildData.addons.party.enabled = enabled;
      }

      if(cat && cat != guildData.addons.party.category) {
        guildData.addons.party.category = cat.id
      }

      if(role && role.id != guildData.addons.party.roleTag) {
        guildData.addons.party.roleTag = role.id;
      }
       
      guildData.markModified("addons.party");
      await guildData.save();
    }
  },
};
