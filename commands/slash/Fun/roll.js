const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roll",
  type: 1,
  owner: true,
  description: "Jeter les dés !",
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: "" // User permissions needed
},
  category: "fun",
  options: [
    {
        name: 'dice',
        description: 'La valeur par défaut est 100',
        type: 3,
        required: true
    },
],
  run: async ({ client, interaction }) => {
    
    const number = interaction.options.getString('dice');
    if (isNaN(number)) {
      const emb = await client.tools.returnEmb({ state: false, text: 'Nombre invalide'})
        return interaction.reply({ embeds:[emb], ephemeral: true });
    }
    const getRandomNumber = Math.floor(Math.random() * number);
    interaction.reply({ content:getRandomNumber.toString() });
    
  },  
};
