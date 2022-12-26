const client = require('..')
const chalk = require('chalk');
const { ActivityType } = require('discord.js');

client.on("ready", () => {

	client.user.setPresence({
		activities: [{ name: `PornHub Kids`, type: ActivityType.Watching }],
		status: 'dnd',
	});


	console.log(chalk.red(`Logged in as ${client.user.tag}!`)) //skipcq: PYL-JS-0002
});
