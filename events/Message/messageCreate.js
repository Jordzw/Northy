const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const client = require("../../index");
const config = client.config;
const humanizeDuration = require("humanize-duration");

module.exports = {
  name: "messageCreate",
};

client.on("messageCreate", async (message) => {
  if (message.channel.type !== 0) return;
  if (message.author.bot) return;
  if (!message.guild) return;

  let data = {};

  data.guild = await client.Database.fetchGuild(message);
  data.member = await client.Database.fetchMember(message.member);
  data.user = await client.Database.fetchUser(message);

  let prefix = data.guild.prefix;

  if (data.guild) {
    if (
      data.guild.addons.captcha.enabled &&
      !message.content.startsWith(prefix)
    ) {
      if (
        message.channel.id === data.guild.addons.captcha.channel &&
        !message.author.bot
      ) {
        setTimeout(() => {
          message.delete();
        }, 1500);
      }
    }
    if (data.guild.addons.level.enabled) {
      await client.tools.updateXP(message, data, client);
    }
    if (data.member) {
      const nombremsg = parseInt(data.member.stats.totalMsg);
      const nombremsgplus = nombremsg + 1;
      data.member.stats.totalMsg = parseInt(nombremsgplus, 10);
      data.member.markModified("stats");
      await data.member.save();
    }
  }

  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;

  let command = client.commands.get(cmd);

  if (!command) return;

  if (command) {
    if (command.permissions) {
      if (
        !message.member.permissions.has(
          PermissionsBitField.resolve(command.permissions || [])
        )
      )
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `🚫 Désolé, tu n'as pas les permissions pour cette commande.`
              )
              .setColor("Red"),
          ],
        });
    }

    if ((command.owner, command.owner == true)) {
      if (!config.Users.OWNERS) return;

      const allowedUsers = []; // New Array.

      config.Users.OWNERS.forEach((user) => {
        const fetchedUser = message.guild.members.cache.get(user);
        if (!fetchedUser) return allowedUsers.push("*Unknown User#0000*");
        allowedUsers.push(`${fetchedUser.user.tag}`);
      });

      if (!config.Users.OWNERS.some((ID) => message.member.id.includes(ID)))
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `🚫 Commande reservé aux fondateurs ! Utilisateurs autorisées:\n**${allowedUsers.join(
                  ", "
                )}**`
              )
              .setColor("Red"),
          ],
        });
    }

    let userCooldown = client.Cooldown[message.author.id];

    if (!userCooldown) {
      client.Cooldown[message.author.id] = {};
      uCooldown = client.Cooldown[message.author.id];
    }

    let time = uCooldown[command.name] || 0;
    //Check if user has a command cooldown
    if (time && time > Date.now()) {
      let timeLeft = humanizeDuration(Math.ceil(time - Date.now()), {
        round: true,
      });
      await client.tools
        .returnEmb({
          state: false,
          text: `Commande disponible dans\n\`${timeLeft}\``,
          title: "Cooldown",
        })
        .then(async (emb) => {
          return message.channel.send({ embeds: [emb] });
        });
    } else {
      client.Cooldown[message.author.id][command.name] =
        Date.now() + command.cooldown;
    }
    await message.delete();
    try {
      command.run(client, message, args, prefix, config);
    } catch (error) {
      console.error(error);
    }
  }
});
