const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const client = require("../../index");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "messageDelete",
};

client.on("messageDelete", async (message) => {
  if (message.author) {
    if (!message.author.bot) return;
  } else if (!message.partial) return;

  const pathGW = `./tools/giveaway/create/${message.guild.id}/${message.id}.json`;
  const pathParty = `./tools/party/create/${message.guild.id}/${message.id}.json`;
  const pathPoll = `./tools/sondage/create/${message.guild.id}/${message.id}.json`;
  if (fs.existsSync(pathGW)) {
    fs.unlinkSync(pathGW);
  } else if (fs.existsSync(pathParty)) {
    fs.unlinkSync(pathParty);

    let guildData = await client.Database.fetchGuild(message);

    guildData.addons.party.nbParty--;
    guildData.markModified("addons.party");
    await guildData.save();

  } else if (fs.existsSync(pathPoll)) {
    fs.unlinkSync(pathPoll);
  }
});
