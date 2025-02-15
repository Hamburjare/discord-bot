import fs from 'node:fs';
import chalk from 'chalk';
import AsciiTable from 'ascii-table';
import config from '../json/config.json';

const table = new AsciiTable().setHeading('Events', 'Status').setBorder('|', '=', "0", "0");

const loadEvents = async (client, dir) => {
	const files = fs.readdirSync(`./events/${dir}/`).filter(file => file.endsWith('.js'));

	for (const file of files) {
		try {
			const event = await import(`../events/${dir}/${file}`);
			const eventName = event.default.name || file.split('.js')[0];
			if (event.default.once) {
				client.once(eventName, (...args) => event.default.execute(...args, client, config));
			} else {
				client.on(eventName, (...args) => event.default.execute(...args, client, config));
			}
			table.addRow(file.split('.js')[0], '✅');
		} catch (error) {
			table.addRow(file.split('.js')[0], `⛔ ${error.message}`);
		}
	}
};

export default async (client) => {
	const dirs = fs.readdirSync('./events/').filter(dir => fs.lstatSync(`./events/${dir}`).isDirectory());

	await Promise.all(dirs.map(dir => loadEvents(client, dir)));

	console.log(chalk.greenBright(table.toString()));
};