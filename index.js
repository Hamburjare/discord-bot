import { Client, GatewayIntentBits, Partials, Collection, ActivityType } from 'discord.js';
import { MongoClient } from 'mongodb';
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

const DBname = Bun.env.DB_NAME


client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();

const handlers = ['slashCommand', 'events'];
handlers.forEach(async (handler) => {
    const module = await import(`./handlers/${handler}.js`);
    module.default(client);
});

client.login(Bun.env.TOKEN);

export { client, DBclient, DBname };