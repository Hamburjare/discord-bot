const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const { client, DBclient } = require('..');

const config = require('../json/config.json');

const cooldown = new Collection();

client.on('interactionCreate', async interaction => {
	const slashCommand = client.slashCommands.get(interaction.commandName);
	if (interaction.type === 4) {
		if (slashCommand.autocomplete) {
			const choices = [];
			await slashCommand.autocomplete(interaction, choices)
		}
	}
	if (!interaction.type === 2) return;

	if (!slashCommand) return client.slashCommands.delete(interaction.commandName);
	try {
		if (slashCommand.cooldown) {
			const db = DBclient.db('HamburjareDB');
			const collection = db.collection('server-config');
			const filter = { _id: interaction.guild.id };
			var result = await collection.findOne(filter);
			if (result === null || result === undefined) {
				await collection.insertOne({
					_id: interaction.guild.id, messages: {
						COOLDOWN_MESSAGE: 'You are on `<duration>` cooldown!'
					}
				}, function (err, res) {
					if (err) throw err;
					result = res;
				});

			}

			if (cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) {
				interaction.reply({ content: result.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), { long: true })), ephemeral: true })
				return
			}
			if (slashCommand.userPerms || slashCommand.botPerms) {
				if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					interaction.reply({ embeds: [userPerms], ephemeral: true })
					return
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					interaction.reply({ embeds: [botPerms], ephemeral: true })
					return
				}

			}

			await slashCommand.run(client, interaction);
			cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
			setTimeout(() => {
				cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
			}, slashCommand.cooldown)
		} else {
			if (slashCommand.userPerms || slashCommand.botPerms) {
				if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					interaction.reply({ embeds: [userPerms], ephemeral: true })
					return
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					interaction.reply({ embeds: [botPerms], ephemeral: true })
					return
				}

			}
			await slashCommand.run(client, interaction);
		}
	} catch (error) {
		console.log(error);
	}
});