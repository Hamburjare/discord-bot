import chalk from 'chalk';

export default {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(chalk.green(`Logged in as ${client.user.tag}!`));
	},
}