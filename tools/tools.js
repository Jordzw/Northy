const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const client = require("../index");
const config = require("../config/config.json");

module.exports.convertTime = async function (milliseconds) {
  let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
  let days = roundTowardsZero(milliseconds / 86400000),
    hours = roundTowardsZero(milliseconds / 3600000) % 24,
    mins = roundTowardsZero(milliseconds / 60000) % 60,
    secs = roundTowardsZero(milliseconds / 1000) % 60;
  if (secs === 0) {
    secs++;
  }
  let laDays = days > 0,
    laHours = hours > 0,
    laMinutes = mins > 0;
  let pattern =
    (!laDays ? "" : laMinutes || laHours ? "{days} days, " : "{days} days & ") +
    (!laHours ? "" : laMinutes ? "{hours} hours, " : "{hours} hours & ") +
    (!laMinutes ? "" : "{mins} mins") +
    " {secs} seconds";
  let sentence = pattern
    .replace("{duration}", pattern)
    .replace("{days}", days)
    .replace("{hours}", hours)
    .replace("{mins}", mins)
    .replace("{secs}", secs);
  return sentence;
};

module.exports.convertDate = async function (time) {
  // get your number
  const date = new Date(time); // create Date object
  let month, day;
  if (date.getDate() < 10) {
    day = "0" + date.getDate();
  } else {
    day = date.getDate();
  }
  if (date.getMonth() + 1 < 10) {
    month = "0" + (date.getMonth() + 1);
  } else {
    month = date.getMonth() + 1;
  }
  const formatDate = `${day}/${month}/${date.getFullYear()}`;

  return [date.toString(), formatDate];
};

module.exports.randomNumber = async function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports.resolveChannel = async function (search, guild) {
  let channel = null;
  if (!search || typeof search !== "string") return;
  //Try to search using ID
  if (search.match(/^#&!?(\d+)$/)) {
    let id = search.match(/^#&!?(\d+)$/)[1];
    channel = guild.channels.cache.get(id);
    if (channel) return channel;
  }
  //Got fucking lazy so I just removed the <#>
  if (search.includes("<#")) {
    let firstChannel = search.replace("<#", "");
    let channelID = firstChannel.replace(">", "");
    let channel = guild.channels.cache.get(channelID);
    if (channel) return channel;
  }
  //Try to search it using name
  channel = guild.channels.cache.find(
    (c) => search.toLowerCase() === c.name.toLowerCase()
  );
  if (channel) return channel;
  //Try to find the channel itself
  channel = guild.channels.cache.get(search);
  return channel;
};

let xpCooldown = {};
module.exports.updateXP = async function (msg, data, client) {
  const points = parseInt(data.member.profil.exp);
  const level = parseInt(data.member.profil.lvl);

  // if the member is already in the cooldown db
  const isInCooldown = xpCooldown[msg.author.id];
  if (isInCooldown) {
    if (isInCooldown > Date.now()) {
      return;
    }
  }
  // Records in the database the time when the member will be able to win xp again (1min)
  const toWait = Date.now() + 2500;
  xpCooldown[msg.author.id] = toWait;

  const max = 8;
  const min = 4;
  const won =
    Math.floor(Math.random() * (max - min + 1)) +
    min * data.guild.addons.level.taux;

  const newXp = parseInt(points + won, 10);

  // calculation how many xp it takes for the next new one
  const neededXp = 5 * (level * level) + 110 * level + 100;
  data.needxp = neededXp;
  // check if the member up to the next level
  if (newXp > neededXp) {
    data.member.profil.lvl++;
    client.emit("LevelUp", data, msg);
  }

  // Update user data
  data.member.profil.exp = parseInt(newXp, 10);
  console.log(data.member.profil.exp);
  data.member.markModified("profil");
  await data.member.save();
};

module.exports.resolveMember = async function (search, guild) {
  let member = null;
  if (!search || typeof search !== "string") return;
  // Try to search using ID
  if (search.match(/^<@!?(\d+)>$/)) {
    const id = search.match(/^<@!?(\d+)>$/)[1];
    member = await guild.members.fetch(id).catch(() => {});
    if (member) return member;
  }
  //Try to search using username
  if (search.match(/^!?(\w+)#(\d+)$/)) {
    guild = await guild.fetch();
    member = guild.members.cache.find((m) => m.user.tag === search);
    if (!member) {
      member = guild.members
        .fetch({ cache: true })
        .then((m) =>
          m.find((m) => m.user.tag.toLowerCase() === search.toLowerCase())
        );
    }
    if (member) return member;
  }
  //Try to find the user itself
  member = await guild.members.fetch(search).catch(() => {});
  return member;
};

module.exports.updateChannelStats = async function (nw) {
  const config = client.config;

  const channelMembres = nw.guild.channels.cache.find(
    (x) => x.id === "938457355195150387"
  );
  const channelFriends = nw.guild.channels.cache.find(
    (x) => x.id === "938457386593701950"
  );
  //const channelSub = message.guild.channels.cache.find(x => x.id === '938457386593701950');

  const roleMembres = nw.guild.roles.cache.find(
    (role) => role.id === "626083815088980008"
  );
  const roleFriends = nw.guild.roles.cache.find(
    (role) => role.id === "632541937613930530"
  );

  channelMembres
    .setName("🌎 Membres: " + roleMembres.members.size)
    .catch((error) => console.log(error));

  channelFriends
    .setName("👋 Friends: " + roleFriends.members.size)
    .catch((error) => console.log(error));
};

module.exports.returnEmb = async function ({ state, text, title }) {
  const newEmb = new EmbedBuilder()
    .setTitle(state ? "Success" : "Error")
    .setColor(state ? config.Color.success : config.Color.error)
    .setDescription(text);

  if (title) {
    newEmb.data.title = title;
  }

  return newEmb;
};

module.exports.awaitConfirmation = async function ({
  state,
  interaction,
  text,
  user,
}) {
  let confirm = null;
  const filter = (i) => {
    i.deferUpdate();
    return i.user.id === user.id;
  };

  const YesOrNo = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("yes")
      .setEmoji("<:check_white:994737357255344271>")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("no")
      .setEmoji("<:cross_white:973876814780960778> ")
      .setStyle(ButtonStyle.Danger)
  );

  const embConfirm = new EmbedBuilder()
    .setColor("#6568e3")
    .setTitle("Confirmation ?")
    .setDescription(text);

let embed_confirm;
  if (state == "follow") {
    embed_confirm = await interaction.followUp({
      embeds: [embConfirm],
      components: [YesOrNo],
      ephemeral: true,
    });
  } else if (state == "reply") {
    embed_confirm = await interaction.reply({
      embeds: [embConfirm],
      components: [YesOrNo],
      ephemeral: true,
    });
  }
    else if (state == "editreply") {
        embed_confirm = await interaction.editReply({
          embeds: [embConfirm],
          components: [YesOrNo],
          ephemeral: true,
        });
  }

  await embed_confirm
    .awaitMessageComponent({
      filter,
      componentType: ComponentType.Button,
      time: 60000,
    })
    .then(async (collected) => {
      if (collected.customId === "yes") {
        confirm = true;
      } else {
        confirm = false;
      }
    })
    .catch((err) => console.log(`${err}`));
  return confirm;
};
