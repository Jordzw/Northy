const client = require("../../index");
const colors = require("colors");
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "GwUserAdd",
};

client.on("GwUserAdd", async (intgw) => {

      const data = {};

      data.guild = await client.Database.fetchGuild(intgw);

      //PARTY REAC
      const gw_service = require("../../tools/giveaway/GwService");

      let gwmsg = await intgw.message.channel.messages
        .fetch(intgw.message.id)
        .catch(console.error);

      const path = `./tools/giveaway/create/${intgw.guild.id}/${intgw.message.id}.json`;

      if (fs.existsSync(path)) {
        try {
          // Récupération du sondage
          var giveaway = await gw_service.getGw(
            intgw
          );

          const index = giveaway.participants.findIndex(
            ({ id }) => id == intgw.user.id
          );

          if (index != -1) {
            giveaway.participants.splice(index, 1);

            await client.tools.returnEmb({ state: false, title: 'Aurevoir !',text: 'Vous ne participez plus'})
            .then(async (item) => {
              await intgw.reply({ embeds: [item], ephemeral: true })
            });
          }
          else {

            let player = {};
            player["name"] = intgw.user.username;
            player["id"] = intgw.user.id;
            player["guild"] = {
              "id": intgw.guild.id
            } 
            giveaway.participants.push(player);
  
            await client.tools.returnEmb({ state: true, text: 'Bienvenu(e) dans le giveaway !'})
              .then(async (item) => {
                await intgw.reply({ embeds: [item], ephemeral: true })
              });
          }

          await gw_service.saveGw(intgw, giveaway, intgw.user);

          // await intgw.update({ embeds: [gwmsg.embeds[0]] });
        } catch (error) {
          console.error(
            "Something went wrong when fetching the message: ",
            error
          );
          return;
        }
    }
});
