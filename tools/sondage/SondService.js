const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { json } = require("stream/consumers");

module.exports = {
  async createSond(msgp, choix, title) {
    var fileName = msgp.id;
    if (!msgp.id) {
      return message.reply("invalid name");
    }

    let jsonFile = {
      msgid: msgp.id,
      chid: msgp.channel.id,
      title: title,
      choix: choix,
      participants: [],
    };

    var dir = `./tools/sondage/create/${msgp.guild.id}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    let data = JSON.stringify(jsonFile);
    fs.writeFileSync(
      `./tools/sondage/create/${msgp.guild.id}/${fileName}.json`,
      data
    );
  },

  async getAllSond(interaction) {

    var dir = `./tools/sondage/create/${interaction.guild.id}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const choices = [];
    const jsonsInDir = fs
      .readdirSync(`./tools/sondage/create/${interaction.guild.id}`)
      .filter((file) => path.extname(file) === ".json");

    jsonsInDir.forEach((file) => {
      const fileData = fs.readFileSync(
        path.join(
          `./tools/sondage/create/${interaction.guild.id}`,
          file
        )
      );
      const json = JSON.parse(fileData.toString());
      choices.push(json);
    });

    return choices;
  },

  async getSond(interaction, user, message) {
    delete require.cache[
      require.resolve(
        `./create/${interaction.guild.id}/${interaction.message.id}.json`
      )
    ];
    var party = require(`./create/${interaction.guild.id}/${interaction.message.id}.json`);
    return party;
  },

  async getSondById(id, guildId) {
    delete require.cache[
      require.resolve(`./create/${guildId.guild.id}/${id}.json`)
    ];
    var party = require(`./create/${guildId.guild.id}/${id}.json`);
    return party;
  },
  async saveSond(interaction, party, user) {
    fs.writeFileSync(
      `./tools/sondage/create/${interaction.guild.id}/${interaction.message.id}.json`,
      JSON.stringify(party)
    );
  },
  async deleteSond(client, id) {
    id.message.delete();

    const jsonsInDir = fs
      .readdirSync(`./tools/sondage/create/${id.guild.id}/`)
      .filter((file) => path.extname(file) === ".json");
    let good_sond;

    for (let i = 0; i < jsonsInDir.length; i++) {
      const fileData = fs.readFileSync(
        path.join(
          `./tools/sondage/create/${id.guild.id}/`,
          jsonsInDir[i]
        )
      );
      const json = JSON.parse(fileData.toString());
      if (json.admin === id.message.id) {
        good_sond = json.msgid;
        break;
      }
    }

    const path_sond = `./tools/sondage/create/${id.guild.id}/${good_sond}.json`;
    if (fs.existsSync(path_sond)) {
      try {
        let sondage = await this.getSondById(good_sond, id);

        let channelSond = id.guild.channels.cache.get(sondage.chid);
        let msgsond = await channelSond.messages
          .fetch(sondage.msgid)
          .catch(console.error);

        fs.unlinkSync(
          `./tools/sondage/create/${id.guild.id}/${good_sond}.json`
        );
        await msgsond.delete();
      } catch (error) {
        console.error(
          "Something went wrong when fetching the message: ",
          error
        );
        return;
      }
    }
  },

  async endSond(client, interaction) {
    const data = {};

    data.guild = await client.Database.fetchGuild(interaction);

    const sondageId = interaction.options.get("sondage").value;
    const path_sond = `./tools/sondage/create/${interaction.guild.id}/${sondageId}.json`;
    if (fs.existsSync(path_sond)) {
      try {
        let sondage = await this.getSondById(sondageId, interaction);

        let channelSond = interaction.guild.channels.cache.get(sondage.chid);
        let msgsond = await channelSond.messages
          .fetch(sondage.msgid)
          .catch(console.error);

        let newEmb = EmbedBuilder.from(msgsond.embeds[0])

        newEmb.data.title = newEmb.data.title + " (Terminé)";
        newEmb.setColor(data.guild.config.color.main);

        function leaderboards(users) {
          return users.sort((a, b) => b.nbvote - a.nbvote);
        }

        const highvote = leaderboards(sondage.choix);

        newEmb.data.fields[highvote[0].field].value = newEmb.data.fields[highvote[0].field].value + " ⭐";

        for (let i = 1; i < highvote.length; i++) {
          if (highvote[0].nbvote === highvote[i].nbvote) {
            newEmb.data.fields[highvote[i].field].value = newEmb.data.fields[highvote[i].field].value + " ⭐";
          }
        }

        msgsond.edit({ embeds: [newEmb], components: [] });

        await client.tools.returnEmb({ state: true, text: `Le sondage ${sondage.title} a bien été terminé !`})
          .then(async (emb) => {
            await interaction.reply({ embeds: [emb], ephemeral: true })
          });

        fs.unlinkSync(
          `./tools/sondage/create/${interaction.guild.id}/${sondageId}.json`
        );
      } catch (error) {
        console.error(
          "Something went wrong when fetching the message: ",
          error
        );
        return;
      }
    } else {
      const embErr = new EmbedBuilder()
        .setTitle("Impossible de cloturer le sondage")
        .setDescription("Ce sondage a déjà été cloturé ou supprimé")
        .setColor("#FC3131");

      interaction.reply({ embeds: [embErr], ephemeral: true });
    }
  },
};
