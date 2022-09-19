const fs = require('fs');
const { MessageActionRow, MessageButton, EmbedBuilder } = require("discord.js");
const PartyService = require('../../tools/party/PartyService');
const client = require("../../index");

module.exports = {
    name: "partyUserAdd",
  };

  client.on("partyUserAdd", async (data) => {

        let EventSched = data.EventSched;
        let user = data.user;
        let channel;

        let party = await PartyService.getParty(EventSched.id, EventSched.guild.id);

        if(data.retard) {
            data.interaction.deferUpdate();
            channel = await data.interaction.guild.channels.cache.get(party.id.chId);
        } else {
            channel = await EventSched.guild.channels.cache.get(party.id.chId);
        }
        let msgp = await channel.messages.fetch(party.id.msgId)
            .catch(console.error);

        const index = party.participants.findIndex(({
            id
        }) => id == user.id);
        const indexsub = party.sub.findIndex(({
            id
        }) => id == user.id);


        //SI PARTICIPE DEJA
        if (index != -1 || indexsub != -1) {
            return;
        }

        //PLUS DE PLACE DONC ON AJOUTE SUB
        if (party.participants.length >= party.nbpart && indexsub === -1) {
            const sub = {};
            sub['pseudo'] = user.username;
            sub['id'] = user.id;

            const thread = msgp.channel.threads.cache.find(x => x.id === party.id.threadId);
            await thread.members.add(user.id);

            party.sub.push(sub);
        }

        //ON AJOUTE LE PARTICIPANT
        if (party.participants.length < party.nbpart && index === -1 && indexsub === -1) {
            const player = {};
            player['pseudo'] = user.username;
            player['id'] = user.id;

            party.participants.push(player);

            const thread = msgp.channel.threads.cache.find(x => x.id === party.id.threadId);
            await thread.members.add(user.id);

            const role = await msgp.guild.roles.fetch(party.id.roleId);
            msgp.guild.members.fetch(user.id).then(member => {
                    member.roles.add(role);
                });
        }

        await PartyService.saveParty(EventSched.id, EventSched.guild.id, party);
        await PartyService.updateParty(party, msgp);

    });