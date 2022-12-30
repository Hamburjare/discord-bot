const client = require('..')
const chalk = require('chalk');
const { ActivityType } = require('discord.js');
const config = require('../json/config.json');

client.on("ready", () => {

	client.user.setPresence({
		activities: [{ name: config.presence["MESSAGE"], type: ActivityType.Playing }],
		status: config.presence["STATUS"],
	});


	console.log(chalk.red(`Logged in as ${client.user.tag}!`)) //skipcq: PYL-JS-0002
});
