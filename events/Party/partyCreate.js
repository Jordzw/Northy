const {
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const PartyService = require("../../tools/party/PartyService");
const client = require("../../index");

module.exports = {
  name: "partyCreate",
};

client.on("partyCreate", async (EventSched) => {
  const guildData = await client.Database.fetchGuild(EventSched);

  if (guildData.addons.party.enabled) {
    const partyDb = require("../../tools/party/db.json");
    const argsEnt = EventSched.entityMetadata.location.split("/");
    let PartMax, color;
    let roleTag = "800771123930464356";

    var re = /[0-9A-Fa-f]{6}/g;
    for (let i = 0; i < argsEnt.length; i++) {
      if (re.test(argsEnt[i])) {
        color = argsEnt[i];
      } else if (argsEnt[i] > 0 && argsEnt[i] < 100) {
        PartMax = argsEnt[i];
      }
    }

    if (color == null) {
      color = "Random";
    }
    if (PartMax == null) {
      PartMax = 95;
    }

    const found = partyDb.find((item) => item.id == EventSched.image);
    if (found != undefined) {
      if (found.color) {
        color = found.color;
      }
      if (found.role) {
        roleTag = found.role;
      }
    }

    //REMOVE 5 LAST CH
    let dateGood = await client.tools.convertDate(
      EventSched.scheduledStartTimestamp
    );
    dateGood = dateGood[1].slice(0, -5).replace("/", "-");

    //CREATE ROLE
    const RolePart = await EventSched.guild.roles
      .create({
        name: EventSched.name,
        color: color,
      })
      .catch((e) => console.error(`Je n'ai pas pu créer le rôle ! ${e}`));

    await EventSched.guild.members
      .fetch(EventSched.creator.id)
      .then((member) => {
        member.roles.add(RolePart);
      });

    //CREATE CHANNEL
    const channel = await EventSched.guild.channels.create({
      name: `${dateGood}┃${EventSched.name}`,
      type: ChannelType.GuildText,
      parent: guildData.addons.party.category,
    });

    let channelVoc = await EventSched.guild.channels.create({
      name: EventSched.name,
      type: ChannelType.GuildVoice,
      parent: guildData.addons.party.category,
      permissionOverwrites: [
        // {
        //     id: RolePart.id, //To make it be seen by a certain role, user an ID instead
        //     allow: ['VIEW_CHANNEL', 'CONNECT'] //Deny permissions
        // },
        {
          id: EventSched.guild.roles.everyone.id, //To make it be seen by a certain role, user an ID instead
          deny: [PermissionsBitField.Flags.ViewChannel], //Deny permissions
        },
      ],
    });

    // await EventSched.edit({
    //     entityType: "VOICE",
    //     channel: channelVoc
    // })

    var invURL = await EventSched.createInviteURL({
      channel: channel,
      maxAge: 0,
    });

    const emb = new EmbedBuilder()
      .setTitle("Participants (1/" + PartMax + ")")
      .setColor(color)
      .setImage(
        "https://cdn.discordapp.com/attachments/935220644474413086/938836929527549962/barreFull.png"
      )
      .setDescription("`" + EventSched.creator.username + "`");
    const msg_send = await channel.send({
      content: `${invURL} <@&${roleTag}>`,
      embeds: [emb],
    });

    //CREATE THREAD
    const thread = await msg_send.startThread({
      name: EventSched.name,
      autoArchiveDuration: 10080,
    });

    await PartyService.createParty({
      client: client,
      color: color,
      EventSched,
      msg_send,
      PartMax,
      thread,
      voc_channel: channelVoc.id,
      role: RolePart.id,
    });

    guildData.addons.party.nbParty++;
    guildData.markModified("addons.party");
    await guildData.save();
  }
});
