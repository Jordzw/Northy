const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "emotes",
  type: 1,
  permissions: {
	DEFAULT_PERMISSIONS: "", // Client permissions needed
	DEFAULT_MEMBER_PERMISSIONS: "" // User permissions needed
},
  description: "Affiche tous les emotes du serveur !",
  run: async ({ client, interaction, guildData }) => {
    
		const emojis = interaction.guild.emojis.cache.map((r) => r)

    for(let i=0;i<emojis.length;i++){

      if(i % 11== 0){
        emojis.splice(i, 0, '\n')
      }

    }
		const embed = new EmbedBuilder()
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }) 
			.setTitle(
				`${interaction.guild.emojis.cache.filter((r) => r.animated === false).size} Emotes, ${
					interaction.guild.emojis.cache.filter((r) => r.animated).size
				} Animated (${interaction.guild.emojis.cache.size} Total)`,
			)
			.setDescription(emojis.join(' ').toString())
			.setColor(guildData.config.color.main)
			.setFooter({ text:`Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		return interaction.reply({ embeds: [embed] });
    
  },  
};
