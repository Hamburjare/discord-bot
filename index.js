require('dotenv').config()
const { Client, GatewayIntentBits, Partials, Collection, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const DBclient = new MongoClient(process.env.MONGODB_URI);
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
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});


client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
module.exports = { client, DBclient};

['slashCommand', 'events'].forEach((handler) => {
	require(`./handlers/${handler}`)(client)
});

client.login(process.env.TOKEN)
