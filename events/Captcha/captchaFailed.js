const client = require("../../index");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "captchaFailed",
};

client.on("captchaFailed", async (member, captcha) => {
 
    let guildData = await client.Database.fetchGuild(member);

    const emb = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL() })
        .setTitle('<a:captchaFail:1014190143197949983> Captcha Failed')
        .addFields(
          { name: 'Tentatives', value: captcha.tent, inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'Captcha Code', value: '`' + captcha.code + '`', inline: true },
        )
        .setTimestamp()
        .setColor(guildData.config.color.error);
        if(guildData.addons.logs.enabled) {
            const channel = await member.guild.channels.cache.get(guildData.addons.logs.channel);
            if(channel){    
            await channel.send({ embeds: [emb] });
            }
        }

});
