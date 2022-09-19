const fs = require('fs');
const { EmbedBuilder } = require("discord.js");

module.exports = {

    async createParty({ EventSched, msg_send, PartMax, thread, dateGood, client, color, role, voc_channel }) {
        var fileName = EventSched.id
        if (!EventSched.id) {
            return message.reply('invalid name')
        };

        var jsonFile = {
            title: EventSched.name,
            id: { EventId: EventSched.id, msgId: msg_send.id, chId: msg_send.channel.id, guildId: EventSched.guild.id, threadId: thread.id, roleId: role, vocId: voc_channel },
            date: dateGood,
            nbpart: PartMax,
            color: color,
            participants: [],
            sub: [],
        };


        await thread.members.add(EventSched.creator);

        player = {};
        player['pseudo'] = EventSched.creator.username;
        player['id'] = EventSched.creator.id;
        jsonFile.participants.push(player);

        let data = {};
        const memberData = await client.Database.fetchCreator(EventSched);
        data.memberData = memberData;

        if (data.memberData.stats.orgaParty == undefined) {
            data.memberData.stats.orgaParty = 0;
        }
        data.memberData.stats.orgaParty++;
        data.memberData.markModified("stats");
        await data.memberData.save();

        var dir = `./tools/party/create/${EventSched.guild.id}`

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        let data_json = JSON.stringify(jsonFile);
        fs.writeFileSync(`./tools/party/create/${EventSched.guild.id}/${fileName}.json`, data_json);

    },

    async getParty(id, guildId) {
        delete require.cache[require.resolve(`./create/${guildId}/${id}.json`)];
        var party = require(`./create/${guildId}/${id}.json`);
        return party;
    },

    async updateParty(party, msgp) {


        const partText = party.participants.map(n => '`' + n.pseudo + '`');
        const subText = party.sub.map(n => '`' + n.pseudo + '`');

        //AFFICHE SUB OU PAS
        if (party.sub.length >= 1) {
            msgp.embeds[0].fields[0] = { name: `Sub (${party.sub.length})`, value: subText.toString() || "\u200B" };
        } else {
            msgp.embeds[0].fields[0] = [];
        }

        const desc = party.participants.length > 0 ? partText.toString() : "`Aucun`";
        msgp.embeds[0].description = desc;

        const receivedEmbed = msgp.embeds[0];
        const newEmbed = EmbedBuilder.from(receivedEmbed)
            .setDescription(desc)
            .setTitle(`Participants (${party.participants.length}/` + party.nbpart + ')');


        msgp.edit({ embeds: [newEmbed] })
    },

    async saveParty(id, guildId, party) {
        fs.writeFileSync(`./tools/party/create/${guildId}/${id}.json`, JSON.stringify(party));
    },
}