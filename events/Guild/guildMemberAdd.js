const client = require("../../index");
const colors = require("colors");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
};

client.on("guildMemberAdd", async (member) => {
  let guildData = await client.Database.fetchGuild(member);
  let tent = "";

  //SI ON TROUVE BIEN UNE GUILD
  if (guildData) {
    //SI C'EST NORTHWAY
    // if (member.guild.id === client.config.Guild.main_guild) {
    //   //UPDATE CHANNEL STATS
    //   await client.tools.updateChannelStats(member);

    //   const roleSeparator = [
    //     "810324992108527637",
    //     "810324241186422785",
    //     "832295364760829973",
    //     "822292227979214899",
    //     "832292196031135774",
    //   ];

    //   roleSeparator.forEach(async (roleId) => {
    //     const roleSep = member.guild.roles.cache.get(roleId);
    //     if (roleSep) await member.roles.add(roleSep);
    //   });
    // }

    //CAPTCHA ACTIVÉ
    if (guildData.addons.captcha.enabled) {
      const roleReg = member.guild.roles.cache.get(
        guildData.addons.captcha.registerRole
      );

      const CHANNEL_WEL = await member.guild.channels.cache.get(
        guildData.addons.captcha.channel
      );
      let attempts = guildData.addons.captcha.attempts;

      const IMG_WEL = [
        {
          code: "plipli",
          url: "https://cdn.discordapp.com/attachments/833289708690866247/992348313552683008/1.png",
        },
        {
          code: "aigri",
          url: "https://cdn.discordapp.com/attachments/833289708690866247/992348313774985287/2.png",
        },
        {
          code: "north",
          url: "https://cdn.discordapp.com/attachments/833289708690866247/992348313972125736/3.png",
        },
        {
          code: "ouin",
          url: "https://cdn.discordapp.com/attachments/833289708690866247/992348314211188776/4.png",
        },
        {
          code: "crown",
          url: "https://cdn.discordapp.com/attachments/833289708690866247/992348314488016906/5.png",
        },
      ];

      let captcha = IMG_WEL[Math.floor(Math.random() * IMG_WEL.length)];

      const EMB_WEL = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.displayAvatarURL(),
        })
        .setTitle("Bienvenue chez " + member.guild.name)
        .setDescription(
          "Afin de profiter pleinement du discord il te faudra effectuer une petite vérification !"
        )
        .setImage(captcha.url)
        .setColor("#f9df04")
        .setFooter({ text: "Essais restants: " + attempts });

      let send_msg = await CHANNEL_WEL.send({ embeds: [EMB_WEL] });

      const filter = (x) => {
        return x.author.id === member.id;
      };

      async function captchaStart(captcha) {
        CHANNEL_WEL.awaitMessages({
          filter,
          max: 1,
          time: 300000,
          errors: ["time"],
        })
          .then(async (rep) => {
            let answer = String(rep.first());
            tent =
              tent +
              "`" +
              (guildData.addons.captcha.attempts - attempts + 1) +
              "/ " +
              answer.toLowerCase() +
              "`\n";

            if (answer.toLowerCase() === captcha.code) {
              captcha.tent = tent;
              EMB_WEL.setColor(client.config.Color.success);
              EMB_WEL.data.title = "Vérification effectué avec succès";
              EMB_WEL.data.description =
                "Rendez-vous ici pour la suite <#938072126781526016>";
              EMB_WEL.data.footer = {};

              if (roleReg) {
                member.roles.add(roleReg);
              }

              await send_msg.edit({ embeds: [EMB_WEL] });
              client.emit("captchaSuccess", member, captcha);
              setTimeout(() => {
                send_msg.delete();
              }, 10000);

              return true;
            } else {
              if (attempts > 1) {
                attempts--;

                EMB_WEL.data.footer.text = "Essais restants: " + attempts;
                EMB_WEL.setColor(guildData.config.color.error);
                EMB_WEL.data.title = "Erreur, recommence !";

                await send_msg.edit({ embeds: [EMB_WEL] });

                if (attempts > 0) {
                  return captchaStart(captcha);
                }
              }

              captcha.tent = tent;

              client.emit("captchaFailed", member, captcha);
              EMB_WEL.data.title = "Vérification raté";
              EMB_WEL.data.description =
                "Heureusement tu peux recommencer\nEntre la commande: `" +
                guildData.prefix +
                "verify`";
              EMB_WEL.data.footer = {};

              send_msg.edit({ embeds: [EMB_WEL] });

              setTimeout(() => {
                send_msg.delete();
              }, 15000);

              return false;
            }
          })
          .catch(async (collected) => {
            if (attempts === guildData.addons.captcha.attempts)
              client.emit("captchaBlank", member);
            await send_msg.delete();
          });
      }

      captchaStart(captcha);
    }
  }
});
