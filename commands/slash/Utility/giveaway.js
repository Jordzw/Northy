const {
  EmbedBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const gw_service = require("../../../tools/giveaway/GwService");

module.exports = {
  name: "giveaway",
  description: "Giveaway",
  type: 1,
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.ManageMessages, // User permissions needed
},
  options: [
    {
      name: "create",
      description: "Créer un giveaway",
      type: 1,
      options: [
        {
          name: "titre",
          description: "Saisissez ici le titre",
          type: 3,
          required: true,
        },
        {
          name: "date",
          description: "Date de fin du sondage",
          required: true,
          type: 3,
        },
        {
          name: "description",
          description: "Description du sondage si besoin !",
          type: 3,
        },
        {
          name: "conditions",
          description:
            "Condition pour participer / Séparez vos options avec des virgules !",
          type: 3,
        },
        {
          name: "image",
          description: "As tu une image ? (Pas obligatoire)",
          type: 11,
        },
      ],
    },
    {
      name: "end",
      description: "Add role à un membre",
      type: 1,
      options: [
        {
          name: "giveaway",
          description: "Choissisez le giveaway à terminer",
          type: 3,
          required: true,
          autocomplete: true,
        },
      ],
    },
  ],
  autocomplete: async (interaction, choices) => {
    const gwList = await gw_service.getAllGw(interaction);

    gwList.forEach((item) => {
      choices.push({
        name: `${item.title}`,
        value: `${item.msgid}`,
      });
    });

    interaction.respond(choices).catch(console.error);
  },

  run: async ({ client, interaction, guildData, memberData }) => {
    if (interaction.type == 4) return;
    let creator = interaction.member;
    if (interaction.options._subcommand === "create") {
    
        const title = interaction.options.getString("titre");
        let conditions = interaction.options.getString("conditions");
        let description = interaction.options.getString("description");
        const image = interaction.options.getAttachment("image");
        const date = interaction.options.getString("date");

        if (!description) {
          description = "";
        }

        if (conditions) {
          conditions = conditions.split(",");
          description = description + "\n\n**__Conditions__**";
          conditions.forEach((item) => {
            description = description + "\n- " + item;
          });
        }

        const embPrev = new EmbedBuilder()
          .setTitle(title)
          .setDescription(description ? description : null)
          .setColor(guildData.config.color.main)
          .setFooter({text: `Fin giveaway: ${date}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        if (image) {
          embPrev.setImage(image.attachment);
        }

        try {

        await interaction.reply({ embeds: [embPrev], ephemeral: true });

        let confirmation = await client.tools.awaitConfirmation({
          state: 'follow',
          interaction: interaction,
          text: "Veux tu envoyer ce sondage ?",
          user: creator
      });

        if (confirmation) {
          await client.tools
            .returnEmb({ state: true, text: "Giveaway envoyé avec succès !" })
            .then(async (emb) => {
              await interaction.followUp({ embeds: [emb], ephemeral: true })
            });

            const But = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("GwUserAdd")
                .setLabel("Participer")
                .setEmoji("<:gift_gw:1016819801743687771>​​")
                .setStyle(ButtonStyle.Secondary)
            );
          
          const msg = await interaction.channel.send({ embeds: [embPrev], components: [But] });
          await gw_service.createGw(msg, title);
        } else {
          await client.tools
            .returnEmb({ state: false, text: "Giveaway annulé" })
            .then(async (emb) => {
              interaction.followUp({ embeds: [emb], ephemeral: true });
            });
        }
      } catch(e) {
        return interaction.user.send({
          content: `Désolé, je n'ai pas reussi à créer le Giveaway ${e}`,
        });
      }
    } else if (interaction.options._subcommand === "end") {
      await gw_service.endGw(client, interaction);
    }
  },
};
