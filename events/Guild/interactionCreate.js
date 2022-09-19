const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const client = require("../../index");
const config = client.config;
const humanizeDuration = require("humanize-duration");

module.exports = {
  name: "interactionCreate",
};

client.on("interactionCreate", async (interaction) => {
  // AUTOCOMPLETE SLASH COMMAND
  const slashCommand = client.slash_commands.get(interaction.commandName);
  if (interaction.type == 4) {
    if (slashCommand.autocomplete) {
      const choices = [];
      await slashCommand.autocomplete(interaction, choices);
      return;
    }
  }

  //IF SLASH COMMANDES
  if (interaction.isChatInputCommand()) {
    const command = client.slash_commands.get(interaction.commandName);

    if (!command) return;

    try {
      if (command.owner) {
        if (!config.Users.OWNERS) return;

        const allowedUsers = []; // New Array.

        config.Users.OWNERS.forEach((user) => {
          const fetchedUser = interaction.guild.members.cache.get(user);
          if (!fetchedUser) return allowedUsers.push("*Unknown User#0000*");
          allowedUsers.push(`\`\`\`- ${fetchedUser.user.tag}\`\`\``);
        });

        const emb = await client.tools.returnEmb({
          title: "🚫 Commande reservé aux fondateurs !",
          state: false,
          text: `Utilisateurs autorisées:\n**${allowedUsers.join(", ")}**`,
        });

        if (!config.Users.OWNERS.includes(interaction.user.id)) {
          return interaction.reply({ embeds: [emb], ephemeral: true });
        }
      }

      if (command.cooldown) {
        let userCooldown = client.Cooldown[interaction.user.id];

        if (!userCooldown) {
          client.Cooldown[interaction.user.id] = {};
          uCooldown = client.Cooldown[interaction.user.id];
        }

        let time = uCooldown[command.name] || 0;
        //Check if user has a command cooldown
        if (time && time > Date.now()) {
          let timeLeft = humanizeDuration(Math.ceil(time - Date.now()), {
            round: true,
          });
          const emb = await client.tools.returnEmb({
            state: false,
            text: `Commande disponible dans\n\`${timeLeft}\``,
            title: "Cooldown",
          });

          return interaction.reply({ embeds: [emb] });
        } else {
          client.Cooldown[interaction.user.id][command.name] =
            Date.now() + command.cooldown;
        }
      }

      let guildData = await client.Database.fetchGuild(interaction);
      let memberData = await client.Database.fetchMember(interaction.member);
      let userData = await client.Database.fetchUser(interaction);

      await command.run({
        client: client,
        interaction: interaction,
        guildData: guildData,
        memberData: memberData,
        config: config,
      });
    } catch (e) {
      console.error(e);
    }
  }

  //MENU SUR USER
  else if (interaction.isUserContextMenuCommand()) {
    // User:
    const command = client.user_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config);
    } catch (e) {
      console.error(e);
    }
  }

  //MENU SUR MESSAGE
  else if (interaction.isMessageContextMenuCommand()) {
    // Message:
    const command = client.message_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config);
    } catch (e) {
      console.error(e);
    }
  }

  //FORMULAIRE
  else if (interaction.isModalSubmit()) {
    // Modals:
    const modal = client.modals.get(interaction.customId);

    if (!modal)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Something went wrong... Probably the Modal ID is not defined in the modals handler."
            )
            .setColor("Red"),
        ],
        ephemeral: true,
      });

    try {
      modal.run(client, interaction, config);
    } catch (e) {
      console.error(e);
    }
  }

  //SI L'INTERACTION N'EST PAS UNE COMMANDE
  else if (!interaction.isCommand()) {
    if (!interaction.customId) return;
    if (interaction.customId.startsWith("poll-")) {

      const choice = interaction.customId.replace("poll-", "");
      client.emit("PollEvent", interaction, choice);
    }

    if (interaction.customId == "GwUserAdd") {
      client.emit("GwUserAdd", interaction);
    }

    if (interaction.customId == "partyUserAddRetard") {
      let data = {
        retard: true,
        interaction: interaction,
        user: interaction.user,
        EventSched: {
          id: interaction.message.content
            .slice(30)
            .split(" ")[0]
            .replace("event=", ""),
          guild: {
            id: interaction.guild.id,
          },
        },
      };
      return client.emit("partyUserAdd", (client, data));
    } else if (interaction.customId == "partyUserRemoveRetard") {
      let data = {
        retard: true,
        interaction: interaction,
        user: interaction.user,
        EventSched: {
          id: interaction.message.content
            .slice(30)
            .split(" ")[0]
            .replace("event=", ""),
          guild: {
            id: interaction.guild.id,
          },
        },
      };
      return client.emit("partyUserRemove", (client, data));
    }
  }


});
