import { ApplicationCommandType } from 'discord.js';

export const ping = {
	name: 'ping',
	description: "Tarkista botin viive",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
		interaction.reply({ content: `Ping: **${Math.round(client.ws.ping)} ms**` })
	}
};