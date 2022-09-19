const client = require("../../index");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "captchaSuccess",
};

client.on("captchaSuccess", async (member, captcha) => {
 
    let guildData = await client.Database.fetchGuild(member);

    const emb = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL() })
        .setTitle('<a:captchaSucc:1014189898103791656> Captcha Success')
        .addFields(
          { name: 'Tentatives', value: captcha.tent, inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'Captcha Code', value: '`' + captcha.code + '`', inline: true },
        )
        .setTimestamp()
        .setColor(client.config.Color.success);
        if(guildData.addons.logs.enabled) {
            const channel = await member.guild.channels.cache.get(guildData.addons.logs.channel);
            if(channel){    
            await channel.send({ embeds: [emb] });
            }
        }

});
