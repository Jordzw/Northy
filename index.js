const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config/config.json');
const colors = require("colors");
const cmdCooldown = {};
require('dotenv').config();

// Creating a new client:
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ],
  presence: {
    activities: [{
      name: "test",
      type: 0
    }],
    status: 'dnd'
  }
});

// Host the bot:
require('http').createServer((req, res) => res.end('Ready.')).listen(3000);

// Getting the bot token:
const AuthenticationToken = process.env.TOKEN;
if (!AuthenticationToken) {
  console.warn("[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.json.".red + "\n")
  return process.exit();
};

// Handler:
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();
client.tools = require('./tools/tools');
client.config = require('./config/config.json');
client.Database = require('./database/Mongoose');
client.Cooldown = cmdCooldown;

module.exports = client;

["prefix", "application_commands", "modals", "events", "mongoose"].forEach((file) => {
  require(`./handlers/${file}`)(client);
});

// Login to the bot:
client.login(AuthenticationToken)
  .catch((err) => {
    console.error("[CRASH] Something went wrong while connecting to your bot..." + "\n");
    console.error("[CRASH] Error from Discord API:" + err);
    process.exit();
  });

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
  console.error(promise);
});
