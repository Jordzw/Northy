const client = require("../../index");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "captchaBlank",
};

client.on("captchaBlank", async (member) => {
 
    let guildData = await client.Database.fetchGuild(member);

    const emb = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL() })
        .setTitle('⌛ Captcha Timeout')
        .setTimestamp()
        .setColor(guildData.config.color.error);
        if(guildData.addons.logs.enabled) {
            const channel = await member.guild.channels.cache.get(guildData.addons.logs.channel);
            if(channel){    
            await channel.send({ embeds: [emb] });
            }
        }

});
