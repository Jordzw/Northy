const {
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "clear",
  type: 1,
  permissions: "MANAGE_MESSAGES",
  description: "Supprime le nombre de message demandé",
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.Administrator, // User permissions needed
},
  cooldown: 5000,
  category: "mod",
  options: [
    {
      name: "message",
      description: "Supprime le nombre de message demandé",
      type: 1,
      options: [
        {
          name: "nombre",
          description: "Nombre de message à supprimé",
          required: true,
          type: 10,
        },
      ],
    },
    {
      name: "channel",
      description: "Supprime tous les channel d'une catégorie",
      type: 1,
      options: [
        {
          name: "category",
          description: "Quel catégorie voulez-vous vider ?",
          type: 7,
          required: true,
          channel_types: ["4"],
        },
        {
          name: "type",
          required: true,
          type: 3,
          description: "test",
          choices: [
            {
              name: "Channel Vocal",
              value: "voc_channel",
            },
            {
              name: "Channel Textuel",
              value: "text_channel",
            },
            {
              name: "Les deux",
              value: "all_channel",
            },
          ],
        },
      ],
    },
  ],

  run: async ({ client, interaction }) => {
    if (interaction.options._subcommand == "message") {
      const amount = interaction.options.getNumber("nombre");
      await interaction.channel.bulkDelete(amount, true).then((_message) => {
        interaction.channel
          .send({ content: `J'ai supprimé \`${_message.size}\` messages` })
          .then((sent) => {
            setTimeout(() => {
              sent.delete();
            }, 2500);
          });
      });
    }

    if (interaction.options._subcommand == "channel") {
      const type_channel = await interaction.options.getString("type");
      const cat = await interaction.options.getChannel("category");

      cat.children.cache
        .forEach((item) => {
          if (type_channel == "all_channel") {
            item.delete();
          } else if (type_channel == "voc_channel" && item.type == 2) {
            item.delete();
          } else if (type_channel == "text_channel" && item.type == 0) {
            item.delete();
          }
        })
        .then(async () => {
          await client.tools
            .returnEmb({
              state: true,
              text: `Tous les channels de la catégorie \`${cat.name}\`\nont été supprimé avec succès !`,
            })
            .then(async (emb) => {
              await interaction.reply({ embeds: [emb] });
            });
        });
    }
  },
};
