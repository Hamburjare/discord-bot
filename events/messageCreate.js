const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js')
const ms = require('ms');
const { client, DBclient } = require('..');

const prefix = client.prefix;
const cooldown = new Collection();

client.on('messageCreate', async message => {
	if (message.author.bot) return;
	if (message.channel.type !== 0) return;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	if (cmd.length === 0) return;
	let command = client.commands.get(cmd)
	if (!command) command = client.commands.get(client.aliases.get(cmd));

	if (command) {
		if (command.cooldown) {
			const db = DBclient.db('HamburjareDB');
			const collection = db.collection('server-config');
			const filter = { _id: message.guild.id };
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
			if (cooldown.has(`${command.name}${message.author.id}`)) {
				message.channel.send({ content: result.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })) });
				return
			}
			if (command.userPerms || command.botPerms) {
				if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					message.reply({ embeds: [userPerms] })
					return
				}
				if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					message.reply({ embeds: [botPerms] })
					return
				}
			}

			command.run(client, message, args)
			cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
			setTimeout(() => {
				cooldown.delete(`${command.name}${message.author.id}`)
			}, command.cooldown);
		} else {
			if (command.userPerms || command.botPerms) {
				if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					message.reply({ embeds: [userPerms] })
					return
				}

				if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					message.reply({ embeds: [botPerms] })
					return
				}
			}
			command.run(client, message, args)
		}
	}

});