const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "create",
  type: 1,
  description: "Te permet de créer des channels spécifique ou autres...",
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.ManageChannels, // User permissions needed
},
  cooldown: 10000,
  options: [
    {
      name: "join_to_create",
      description: "Créer un giveaway",
      type: 1,
      options: [
        {
          name: "name",
          type: 3,
          description: "Nom du channel",
          required: true,
        },
        {
          name: "category",
          description: "Ou voulez vous créer le channel ?",
          type: 7,
          channel_types: ["4"],
          required: true,
        }
      ]
    }
  ],
  run: async ({ client, interaction, guildData }) => {

    if(interaction.options._subcommand == 'join_to_create') {

    const name = interaction.options.getString("name");
    const cat = interaction.options.getChannel("category");

    const channel = await interaction.guild.channels.create({
      name: `${name}`,
      type: ChannelType.GuildVoice,
      parent: cat.id,
    });

    guildData.addons.createVoc.channels.push(channel.id);
    guildData.markModified("addons.createVoc");
    guildData.save();
    
    interaction.reply({ embeds: [
      new EmbedBuilder()
        .setDescription(`${client.ws.ping} ms!`)
    ] })
  }



  },  
};
