const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { json } = require("stream/consumers");

module.exports = {
  async createGw(msg, title) {
    var fileName = msg.id;
    if (!msg.id) {
      return message.reply("invalid name");
    }

    let jsonFile = {
      msgid: msg.id,
      chid: msg.channel.id,
      title: title,
      participants: [],
    };

    var dir = `./tools/giveaway/create/${msg.guild.id}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    let data = JSON.stringify(jsonFile);
    fs.writeFileSync(
      `./tools/giveaway/create/${msg.guild.id}/${fileName}.json`,
      data
    );
  },

  async getAllGw(interaction) {

    var dir = `./tools/giveaway/create/${interaction.guild.id}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const choices = [];
    const jsonsInDir = fs
      .readdirSync(`./tools/giveaway/create/${interaction.guild.id}`)
      .filter((file) => path.extname(file) === ".json");

    jsonsInDir.forEach((file) => {
      const fileData = fs.readFileSync(
        path.join(`./tools/giveaway/create/${interaction.guild.id}`, file)
      );
      const json = JSON.parse(fileData.toString());
      choices.push(json);
    });

    return choices;
  },

  async getGw(interaction) {
    delete require.cache[
      require.resolve(
        `./create/${interaction.guild.id}/${interaction.message.id}.json`
      )
    ];
    var giveaway = require(`./create/${interaction.guild.id}/${interaction.message.id}.json`);
    return giveaway;
  },

  async getGwById(id, guildId) {
    delete require.cache[
      require.resolve(`./create/${guildId.guild.id}/${id}.json`)
    ];
    var giveaway = require(`./create/${guildId.guild.id}/${id}.json`);
    return giveaway;
  },
  async saveGw(interaction, giveaway, user) {
    fs.writeFileSync(
      `./tools/giveaway/create/${interaction.guild.id}/${interaction.message.id}.json`,
      JSON.stringify(giveaway)
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
        path.join(`./tools/sondage/create/${id.guild.id}/`, jsonsInDir[i])
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

  async endGw(client, interaction) {
    const data = {};
    let winner;

    data.guild = await client.Database.fetchGuild(interaction);

    const GwId = interaction.options.get("giveaway").value;
    const path_sond = `./tools/giveaway/create/${interaction.guild.id}/${GwId}.json`;
    if (fs.existsSync(path_sond)) {
      try {
        let giveaway = await this.getGwById(GwId, interaction);

        if(giveaway.participants.length < 1) {
          await client.tools.returnEmb({ state: false, title: 'Giveaway Error', text: 'Il n\'y a aucun participant !' })
            .then(async (emb) => {
              await interaction.reply({ embeds: [emb], ephemeral: true})
            })
            return;
        }

        let channelGw = interaction.guild.channels.cache.get(giveaway.chid);
        let msgGw = await channelGw.messages
          .fetch(giveaway.msgid)
          .catch(console.error);

        async function getWinner(state) {
          const rdm = await client.tools.randomNumber(
            0,
            giveaway.participants.length
          );

          winner = await interaction.guild.members.fetch(giveaway.participants[rdm].id);

          data.member = await client.Database.fetchMember(winner);

          const dateJoin = await client.tools.convertDate(
            data.member.infos.registeredAt
          );
          const confirmation = await client.tools.awaitConfirmation({
            state: state,
            interaction: interaction,
            text: `Gagnant: \`${winner.user.username}\`\nJoin le discord: \`${dateJoin[1]}\``,
            user: interaction.user,
          });
          if (!confirmation) {
            await getWinner('editreply');
          }
        }

        await getWinner('reply');

        let editEmb = EmbedBuilder.from(msgGw.embeds[0]);
        editEmb.data.title = msgGw.embeds[0].data.title + " (Terminé)";

        let newEmb = new EmbedBuilder()
        .setTitle('<a:tadaled:797945456511811624> Giveaway Winner <a:tadaled:797945456511811624>')
        .setDescription(`**Félicitations** <@${winner.id}>\nTu remportes le giveaway ci-dessus !`)
        .setThumbnail(winner.displayAvatarURL())
        .setColor("#2f3136");

        msgGw.edit({ content: `<@${winner.id}>`, embeds: [editEmb, newEmb], components: [] });

        fs.unlinkSync(
          `./tools/giveaway/create/${interaction.guild.id}/${GwId}.json`
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
