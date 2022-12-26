const { Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const Keyv = require('keyv');
const keyv = new Keyv(process.env.DATABASE);
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildPresences, 
		GatewayIntentBits.GuildMessageReactions, 
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildIntegrations
	], 
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction] 
});

const config = require('./json/config.json');
require('dotenv').config() // remove this line if you are using replit

client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
module.exports = client;


['slashCommand', 'events'].forEach((handler) => {
  require(`./handlers/${handler}`)(client)
});

keyv.on('error', err => console.error('Keyv connection error:', err));

client.login(process.env.TOKEN)
