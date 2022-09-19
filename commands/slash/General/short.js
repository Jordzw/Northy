const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: axios } = require('axios');

module.exports = {
  name: "short",
  type: 1,
  permissions: {
	DEFAULT_PERMISSIONS: "", // Client permissions needed
	DEFAULT_MEMBER_PERMISSIONS: "" // User permissions needed
},
  description: "Raccourci une URL",
  options: [
	{
		name: 'url',
		description: 'Url à raccourcir',
		type: 3,
		required: true,
	},
	{
		name: 'pass',
		description: 'Password for url',
		type: 3,
	},
],
  run: async ({ client, interaction, guildData }) => {
    
		const url = interaction.options.getString('url');
		const pass = interaction.options.getString('pass') || '';
		const apiToken = 'ezwOvMtEbqJjpxvN'; // Get your api key from <https://i8.ae/user/tools#api>
		if (!apiToken) {
			return interaction.reply({ content: ':x: Missing api token' });
		}
		try {
			const req = await axios({
				url: 'https://i8.ae/api/url/add',
				method: 'POST',
				headers: {
					Authorization: apiToken,
				},
				data: {
					url: url,
					password: pass,
				},
			});
			const data = req.data;
			const row = new   ActionRowBuilder().addComponents(
				new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(data.shorturl).setLabel('URL'),
			);
			interaction.reply({ content: '**Short URL: **<' + data.shorturl + '>', components: [row] });
		} catch (e) {
			console.error(e);
			return interaction.reply({ content: `:x: ${e}` });
		}
    
  },  
};
