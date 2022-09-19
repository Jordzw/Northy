const client = require("../../index");
const colors = require("colors");
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "PollEvent",
};

client.on("PollEvent", async (intsond, choice) => {

      const data = {};

      data.guild = await client.Database.fetchGuild(intsond);

      //PARTY REAC
      const sond_service = require("../../tools/sondage/SondService");

      let msgsond = await intsond.message.channel.messages
        .fetch(intsond.message.id)
        .catch(console.error);

      const path = `./tools/sondage/create/${intsond.guild.id}/${intsond.message.id}.json`;

      if (fs.existsSync(path)) {
        try {
          // Récupération du sondage
          var sondage = await sond_service.getSond(
            intsond,
            intsond.user,
            msgsond
          );

          const index = sondage.participants.findIndex(
            ({ id }) => id == intsond.user.id
          );

          function returnVote(v) {
            return v.id === `${intsond.user.id}`;
          }

          if (index != -1) {
            const found = sondage.participants.find(returnVote);
            const votedel = found.vote - 1;
            sondage.choix[votedel].nbvote--;
            sondage.participants.splice(index, 1);
          }

          const voteplay = parseInt(choice, 10) + 1;

          // Ajouter du voteur
          let player = {};
          player["pseudo"] = intsond.user.username;
          player["id"] = intsond.user.id;
          player["vote"] = voteplay;
          sondage.participants.push(player);

          // ADD 1 vote to 0
          if (choice == "0") {
            sondage.choix[0].nbvote++;
          }
          if (choice == "1") {
            sondage.choix[1].nbvote++;
          }
          if (choice == "2") {
            sondage.choix[2].nbvote++;
          }
          if (choice == "3") {
            sondage.choix[3].nbvote++;
          }
          if (choice === "4") {
            sondage.choix[4].nbvote++;
          }
          if (choice == "5") {
            sondage.choix[5].nbvote++;
          }
          if (choice == "6") {
            sondage.choix[6].nbvote++;
          }
          if (choice == "7") {
            sondage.choix[7].nbvote++;
          }
          if (choice == "8") {
            sondage.choix[8].nbvote++;
          }
          if (choice == "9") {
            sondage.choix[9].nbvote++;
          }

          await sond_service.saveSond(intsond, sondage, intsond.user);
        } catch (error) {
          console.error(
            "Something went wrong when fetching the message: ",
            error
          );
          return;
        }

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

        for (let i = 0; i < sondage.choix.length; i++) {
          const result =
            (sondage.choix[i].nbvote / sondage.participants.length) * 100;
          const result1 = Math.round(result);
          var progression = "";
          for (let i = 0; i < result1 / 5; i++) {
            progression = progression + "█";
          }
          msgsond.embeds[0].fields[i].value = `${progression} ${result1}%`;
          msgsond.embeds[0].fields[
            i
          ].name = `${emojisond[i]}: ${sondage.choix[i].choix} ⁣⁣(${sondage.choix[i].nbvote})`;
        }

        await intsond.update({ embeds: [msgsond.embeds[0]] });
    }
});
