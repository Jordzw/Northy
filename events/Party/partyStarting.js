const fs = require('fs');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require("discord.js");
const PartyService = require('../../tools/party/PartyService');
const client = require("../../index");

module.exports = {
    name: "partyStarting",
  };

  client.on("partyStarting", async (EventSched, oldEvent) => {

        let party = await PartyService.getParty(EventSched.id, EventSched.guild.id);
        if(party) {
        let RolePart = await EventSched.guild.roles.cache.get(party.id.roleId);
        let channel = await EventSched.guild.channels.cache.get(party.id.vocId);
        let channelVoc = await EventSched.guild.channels.cache.get('996840501263216690');
        let guildData = await client.Database.fetchGuild(EventSched);

        let channel_text = await EventSched.guild.channels.cache.get(party.id.chId);
        let msgp = await channel_text.messages.fetch(party.id.msgId)
        .catch(console.error);

        
        const butPart = new ButtonBuilder()
            .setCustomId('partyUserAddRetard')
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Participe en retard');

        const butRemovePart = new ButtonBuilder()
            .setCustomId('partyUserRemoveRetard')
            .setEmoji('<:cross:973876814780960778>')
            .setStyle(ButtonStyle.Danger);
    
        const But = new ActionRowBuilder()
            .addComponents([butPart, butRemovePart]);

        msgp.edit({ components: [But] })

        guildData.addons.party.nbParty++;
        guildData.markModified("addons.party.nbParty");
        await guildData.save();


        await channel.edit({
            permissionOverwrites: [
                    {
                        id: RolePart.id, //To make it be seen by a certain role, user an ID instead
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect] //Deny permissions
                    },
                    {
                        id: EventSched.guild.roles.everyone.id, //To make it be seen by a certain role, user an ID instead
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        deny: [PermissionsBitField.Flags.Connect] //Deny permissions
                    }
            ]
        })
    console.log(channel)
        }

    });