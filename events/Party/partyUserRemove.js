const fs = require('fs');
const { MessageActionRow, MessageButton, EmbedBuilder } = require("discord.js");
const PartyService = require('../../tools/party/PartyService');
const client = require("../../index");

module.exports = {
    name: "partyUserRemove",
  };

  client.on("partyUserRemove", async (data) => {

        let EventSched = data.EventSched;
        let user = data.user;


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

        // SI PARTICIPE PAS ET N'EST PAS SUB
        if (index === -1 && indexsub === -1) {
            return;
        }

        //SI PARTICIPE ON ENLEVE PARTICIPANT
        if (index != -1) {
            party.participants.splice(index, 1);

            const thread = msgp.channel.threads.cache.find(x => x.id === party.id.threadId);
            await thread.members.remove(user.id);

            const role = await msgp.guild.roles.fetch(party.id.roleId);
            msgp.guild.members.fetch(user.id).then(member => {
                    member.roles.remove(role);
                });
        }

        //SI SUB ON ENLEVE SUB
        if (indexsub != -1) {
            party.sub.splice(indexsub, 1);
        }


        //SI Y A DE LA PLACE ET QUE Y A UN SUB
        if (party.participants.length < party.nbpart && party.sub.length > 0) {
            party.participants.push(party.sub[0])

            const usersub = await EventSched.guild.members.fetch(party.sub[0].id);
            const embedSub = new EmbedBuilder()
                .setDescription(`Vous avez reussi à vous procurer une place \npour la soirée **${party.title}** !`)
                .setAuthor({ name: usersub.user.username, iconURL: usersub.user.displayAvatarURL() })
                .setColor('#51F38D');

            await usersub.send({ embeds: [embedSub] });

            const role = await msgp.guild.roles.fetch(party.id.roleId);
            msgp.guild.members.fetch(party.sub[0].id).then(member => {
                    member.roles.add(role);
                });

            party.sub.shift();
        }

        await PartyService.saveParty(EventSched.id, EventSched.guild.id, party);
        await PartyService.updateParty(party, msgp);

    });