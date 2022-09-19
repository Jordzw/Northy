const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
  name: "profil",
  description: "Affiche le profil demandé",
  type: 1,
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: "" // User permissions needed
},
  options: [
    {
      name: "user",
      description:
        "Mentionnez l'utilisateur que vous souhaitez voir ! Laissez vide pour voir le vôtre",
      type: 6,
    },
  ],
  run: async ({ client, interaction, guildData, memberData }) => {
    
    const user = interaction.options.getMember("user");
    if (user) {
      memberData = await client.Database.fetchMember(user);
    }

    const member = user || interaction.member;
    const dateRegister = await client.tools.convertDate(
      memberData.infos.registeredAt
    );

    const profilEmbed = new EmbedBuilder()
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({
          size: 512,
          dynamic: true,
          format: "png",
        }),
      })
      .setImage("attachment://achievements.png")
      .setDescription(memberData.bio ? memberData.bio : "Pas de bio")
      .setColor(guildData.config.color.main)
      .setImage(
        "https://cdn.discordapp.com/attachments/935220644474413086/938836929527549962/barreFull.png"
      )
      .setTimestamp();

      if(guildData.addons.level.enabled) {
        profilEmbed.addFields(
          { name: "📊 Level", value: `**${memberData.profil.lvl}**`, inline: true},
          { name: "🔮 Expérience", value: `**${memberData.profil.exp}** xp`, inline: true},
        );
      }

      profilEmbed.addFields(
        {
        name:"<:NorthcoinSmall:834395754101080085>Argent",
        value: memberData.profil.money.toString(),
        inline: true
        },

        { name: "📅 Enregistré", value:dateRegister[1], inline: true},
        { name: "🎂 Anniversaire", value: "Pas défini", inline: true}
        );


    const butProfil = new ButtonBuilder()
      .setCustomId("showProfil")
      .setEmoji("<:profil:973875669417209917>")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Profil");

    const butInventory = new ButtonBuilder()
      .setCustomId("showInv")
      .setEmoji("<:inv:973874628663595008>")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Inventaire");

    const butStats = new ButtonBuilder()
      .setCustomId("showStats")
      .setEmoji("<:stats:973874307430232094>")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Statistique");

    const butClose = new ButtonBuilder()
      .setCustomId("closeEmb")
      .setEmoji("<:cross:973876814780960778>")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Close");

    const But = new ActionRowBuilder().addComponents([
      butProfil,
      butInventory,
      butStats,
      butClose,
    ]);

    const profil_msg = await interaction.reply({
      embeds: [profilEmbed],
      components: [But],
    });

    //SI REAC
    const filter = (int) => {
      int.deferUpdate();
      return int.user.id === interaction.user.id;
    };

    const collector = profil_msg.createMessageComponentCollector({
      filter,
      componentType: ComponentType.Button,
      time: 21600000,
    });

    collector.on("collect", async (i, author) => {
      if (i.customId === "showProfil") {
        const emb = new EmbedBuilder()
          .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({
              size: 512,
              dynamic: true,
              format: "png",
            }),
          })
          .setDescription(memberData.bio ? memberData.bio : "Pas de bio")
          .addFields(
            {
            name:"<:NorthcoinSmall:834395754101080085>Argent",
            value: memberData.profil.money.toString(),
            inline: true
            },
            { name: "📊 Level", value: `**${memberData.profil.lvl}**`, inline: true},
            { name: "🔮 Expérience", value: `**${memberData.profil.exp}** xp`, inline: true},
            { name: "📅 Enregistré", value:dateRegister[1], inline: true},
            { name: "🎂 Anniversaire", value: "Pas défini", inline: true}
            )
          .setColor(guildData.config.color.main)
          .setImage(
            "https://cdn.discordapp.com/attachments/935220644474413086/938836929527549962/barreFull.png"
          )
          .setTimestamp();

          await interaction.editReply({ embeds: [emb], components: [But] });
      }

      if (i.customId === "showInv") {
        const emb = new EmbedBuilder()
          .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({
              size: 512,
              dynamic: true,
              format: "png",
            }),
          })
          .setDescription("**COMING SOON**")
          .setColor(guildData.config.color.main)
          .setImage(
            "https://cdn.discordapp.com/attachments/935220644474413086/938836929527549962/barreFull.png"
          )
          .setTimestamp();

          await interaction.editReply({ embeds: [emb], components: [But] });
      }

      if (i.customId === "showStats") {
        const emb = new EmbedBuilder()
          .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({
              size: 512,
              dynamic: true,
              format: "png",
            }),
          })
          .setDescription("**COMING SOON**")
          .setColor(guildData.config.color.main)
          .setImage(
            "https://cdn.discordapp.com/attachments/935220644474413086/938836929527549962/barreFull.png"
          )
          .setTimestamp();

        await interaction.editReply({ embeds: [emb], components: [But] });
      }

      if (i.customId === "closeEmb") {
        i.message.delete();
      }
    });
  },
};
