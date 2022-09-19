const {
  EmbedBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const sond_service = require("../../../tools/sondage/SondService");

module.exports = {
  name: "poll",
  description: "Manage roles of the server or members.",
  type: 1,
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.ManageMessages, // User permissions needed
},
  options: [
    {
      name: "create",
      description: "Créer un sondage",
      type: 1,
      options: [
        {
          name: "titre",
          description: "Saisissez ici votre question",
          type: 3,
          required: true,
        },
        {
          name: "options",
          description: "Séparé vos option avec des virgules",
          type: 3,
          required: true,
        },
        {
          name: "description",
          description: "Description du sondage si besoin !",
          type: 3,
        },
        {
          name: "image",
          description: "As tu une image ? (Pas obligatoire)",
          type: 3,
        },
      ],
    },
    {
      name: "end",
      description: "Add role à un membre",
      type: 1,
      options: [
        {
          name: "sondage",
          description: "Choissisez le sondage à terminer",
          type: 3,
          required: true,
          autocomplete: true,
        },
      ],
    },
  ],
  autocomplete: async (interaction, choices) => {
    const sondList = await sond_service.getAllSond(interaction);

    sondList.forEach((item) => {
      choices.push({
        name: `${item.title}`,
        value: `${item.msgid}`,
      });
    });

    interaction.respond(choices).catch(console.error);
  },

  run: async ({ client, interaction, guildData }) => {
    if(interaction.type == 4) return;
    let poll_creator = interaction.member;
    if (interaction.options._subcommand === "create") {
      try {
        //     const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
        //     const role = interaction.options.get('role').role;

        const emojisond = [
          "<:1sond:888742348337590283>",
          "<:2sond:888743182874079262>",
          "<:3sond:888743183129923664>",
          "<:4sond:888743183066988574>",
          "<:5sond:888743182957957150>",
          "<:6sond:888743183012462643>",
          "<:7sond:888743182924406834>",
          "<:8sond:888743182823743490>",
          "<:9sond:888743182962143272>",
          "<:10sond:888752301924307015>",
        ];

        const title = interaction.options.get("titre").value;
        let choices = interaction.options.get("options").value.split(",");
        let msgPoll;

        if (choices.length > 10) {
          const embErr = await client.tools.returnEmb({
           state: false,
           text: "Tu ne peux pas entrer plus de 10 options\nRedonne moi les choix ici ( Toujours séparés par une , )"
        });
          const sendErr = await poll_creator.send({ embeds: [embErr] });

          await collectChoice();

          async function collectChoice() {
            collectArgs = await sendErr.channel.awaitMessages({
              filter: (m) => m.author.id === poll_creator.id && !m.author.bot,
              max: 1,
              time: 1800000,
              errors: ["time"],
            });

            choixsond = collectArgs.first().content;
            arraysond = choixsond.split(",");

            if (arraysond.length > 10) {
              const embErrTwo = await client.tools.returnEmb({
                state: false,
                text: "Tu ne peux pas entrer plus de 10 options\nRedonne moi les choix ici ( Toujours séparés par une , )"
              });

              await poll_creator.send({ embeds: [embErrTwo] });

              await collectChoice();
            } else {
              choices = arraysond;
            }
          }
        }

        const embPrev = new EmbedBuilder().setTitle(title).setColor("#6568e3");

        for (let u = 0; u < choices.length; u++) {
          embPrev.addFields([
            {
              name: `${emojisond[u]}: ${choices[u]}`,
              value: "0%",
            },
          ]);
        }

        await interaction.reply({ embeds: [embPrev], ephemeral: true });

        let confirmation = await client.tools.awaitConfirmation({
          state: 'follow',
          user: poll_creator,
          interaction: interaction,
          text: "Veux tu envoyer ce sondage ?"
      });

        if (confirmation) {
          const arbut = [];
          const arbut2 = [];

          // SI MOINS DE 6 OPTIONS
          if (choices.length < 6) {
            for (let i = 0; i < choices.length; i++) {
              if (i < 5) {
                const namebut = new ButtonBuilder()
                  .setCustomId(`poll-${[i]}`)
                  .setStyle(ButtonStyle.Primary)
                  .setEmoji(emojisond[i]);

                arbut.push(namebut);
              }

              if (i >= 5) {
                const namebut2 = new ButtonBuilder()
                  .setCustomId(`poll-${[i]}`)
                  .setStyle(ButtonStyle.Primary)
                  .setEmoji(emojisond[i]);

                arbut2.push(namebut2);
              }
            }

            if (arbut2.length > 0) {
              const buttons = new ActionRowBuilder().addComponents(arbut);
              const buttons2 = new ActionRowBuilder().addComponents(arbut2);

              msgPoll = await interaction.channel.send({
                embeds: [embPrev],
                components: [buttons, buttons2],
              });
            } else {
              const buttons = new ActionRowBuilder().addComponents(arbut);

              msgPoll = await interaction.channel.send({
                embeds: [embPrev],
                components: [buttons],
              });
            }
          }
          // SI PLUS DE 6 OPTIONS
          else if (choices.length < 11) {
            for (let i = 0; i < choices.length; i++) {
              if (i < choices.length / 2) {
                const namebut = new ButtonBuilder()
                  .setCustomId(`poll-${[i]}`)
                  .setStyle(ButtonStyle.Primary)
                  .setEmoji(emojisond[i]);

                arbut.push(namebut);
              }

              if (i >= choices.length / 2) {
                const namebut2 = new ButtonBuilder()
                  .setCustomId(`poll-${[i]}`)
                  .setStyle(ButtonStyle.Primary)
                  .setEmoji(emojisond[i]);

                arbut2.push(namebut2);
              }
            }

            var buttons = new ActionRowBuilder().addComponents(arbut);
            var buttons2 = new ActionRowBuilder().addComponents(arbut2);

            msgPoll = await interaction.channel.send({
              embeds: [embPrev],
              components: [buttons, buttons2],
            });
          }

          for (let i = 0; i < choices.length; i++) {
            choices[i] = { choix: choices[i], nbvote: 0, field: i };
          }
          const choix = choices;
          await sond_service.createSond(msgPoll, choix, title);
        }
      } catch (e) {
        return interaction.user.send({
          content: `Désolé, Je n'ai pas pu créer le sondage !\n${e}`,
          ephemeral: true,
        });
      }
    }
    
    else if (interaction.options._subcommand === "end") {
      
      await sond_service.endSond(client, interaction)
    }
  },
};
