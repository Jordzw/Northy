const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: 'role',
	type: 1,
  permissions: {
    DEFAULT_PERMISSIONS: "", // Client permissions needed
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.ManageRoles, // User permissions needed
},
	description: 'Ajoute ou retire le rôle à l\'utilisateur ciblé',
	timeout: 5000,
	category: 'mod',
  options:[
    {
      name: 'type',
      description: 'Vous voulez ajouter ou enlever un rôle ?',
      type: 3,
      autocomplete: true,
      required: true,
    },
    {
      name: 'user',
      type: 6,
      description: 'L\'utilisateur concerné',
      required: true,
    },
    {
      name: 'role',
      type: 8,
      description: 'Le rôle en question !',
      required: true,
    }
  ],

  autocomplete: async (interaction, choices) => {
    
    choices.push({
      name: 'add',
      value: 'add'
    },
    {
      name: 'remove',
      value: 'remove'
    }
    );

    interaction.respond(choices).catch(console.error);
  },

  run: async ({ client, interaction }) => {
    
    const type = interaction.options.get('type').value
    const user = interaction.options.getMember('user')
    const role = interaction.options.getRole('role')

    const botRole = interaction.guild.members.me.roles.highest.position;
    const roleToGet = user.roles.highest.position;
    const authorRole = interaction.member.roles.highest.position;

    if(authorRole <= roleToGet || botRole <= roleToGet) {
      const emb = await client.tools.returnEmb({ state: false, text: 'Je n\'ai ou tu n\'as pas les permissions pour faire ça' })
      interaction.reply({
        embeds:[emb],
        ephemeral: true
      })
    } else {

    if(type === 'add') {
      user.roles.add(role).then(async() => {
        const emb = await client.tools.returnEmb({ state: true, text:'Rôle ajouté avec succès' });
        interaction.reply({ 
          embeds:[emb],
          ephemeral: true
        })
      }).catch(console.error);

    } else if(type === 'remove') {
      user.roles.remove(role).then(async() => {
        const emb = await client.tools.returnEmb({ state: false, text: 'Rôle retiré avec succès' });
        interaction.reply({ 
          embeds:[emb],
          ephemeral: true
        })
      }).catch(console.error);

    }
  }
  },  
};
