const guildSchema = require("./schema/guild.js");
const memberSchema = require("./schema/member.js");
const userSchema = require("./schema/user.js");

//Create/find Guilds Database
module.exports.fetchGuild = async function (key) {
  let guildDB = await guildSchema.findOne({ id: key.guild.id });

  if (guildDB) {
    return guildDB;
  } else {
    guildDB = new guildSchema({
      id: key.guild.id,
      name: key.guild.name,
      registeredAt: Date.now(),
    });
    await guildDB.save().catch((err) => console.log(err));
    return guildDB;
  }
};

//Create/find Members Database
module.exports.fetchMember = async function (user) {
  let memberDB = await memberSchema.findOne({ id: user.id, guildId: user.guild.id });
  if (memberDB) {
    return memberDB;
  } else {
    memberDB = new memberSchema({
      id: user.id,
      name: user.username || user.user.username,
      guild: {
        type: Object,
        default: {
          guildId: user.guild.id,
          guildName: user.guild.name,
        },
      },
      registeredAt: Date.now(),
    });
    await memberDB.save().catch((err) => console.log(err));
    return memberDB;
  }
};

module.exports.fetchCreator = async function (key) {
  let memberDB = await memberSchema.findOne({ id: key.creator.id, guildId: key.guild.id });
  if (memberDB) {
    return memberDB;
  } else {
    memberDB = new memberSchema({
      id: key.creator.id,
      name: key.creator.username,
      guild: {
        type: Object,
        default: {
          guildId: key.guild.id,
          guildName: key.guild.name,
        },
      },
      registeredAt: Date.now(),
    });
    await memberDB.save().catch((err) => console.log(err));
    return memberDB;
  }
};

module.exports.fetchUser = async function (key) {
  if (!key.user) {
    key.user = {};
    key.user.username = key.author.username;
    key.user.id = key.author.id;
  }
  let userDB = await userSchema.findOne({ id: key.user.id || key.author.id });
  if (userDB) {
    return userDB;
  } else {
    userDB = new userSchema({
      id: key.user.id,
      name: key.user.username,
      registeredAt: Date.now(),
    });
    await userDB.save().catch((err) => console.log(err));
    return userDB;
  }
};
