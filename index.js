require('dotenv').config()
const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require('discord.js');
const { MongoClient } = require('mongodb');
const DBclient = new MongoClient(process.env.MONGODB_URI);
const config = require('./json/config.json');
DBclient.connect();
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
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction],
	presence: {
		activities: [{ name: config.presence["MESSAGE"], type: ActivityType.Playing }],
		status: config.presence["STATUS"],
	}
});

const DBname = process.env.DB_NAME


client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
module.exports = { client, DBclient, DBname};

['slashCommand', 'events'].forEach((handler) => {
	require(`./handlers/${handler}`)(client)
});

client.login(process.env.TOKEN)