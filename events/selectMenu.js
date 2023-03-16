const { client, DBclient } = require('..');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    try {
        DBclient.connect();
        const database = DBclient.db("HamburjareDB");
        const collection = database.collection("server-config");
        const filter = { _id: interaction.guild.id };
        const result = await collection.findOne(filter);
        if (interaction.customId === 'settings') {
            const dropdown = new ActionRowBuilder()
                .addComponents(new StringSelectMenuBuilder()
                    .setCustomId('settings')
                    .setPlaceholder('Select a setting')
                    .addOptions([
                        {
                            label: 'LinkLand',
                            description: 'Update the linkland settings',
                            value: 'linkland',
                        },
                        {
                            label: 'Bullying',
                            description: 'Update the bullying settings',
                            value: 'bullying'
                        },
                    ])
                )
            if (interaction.values[0] === 'linkland') {

                const allowedChannels = [];
                result.linkland["allowedChannels"].forEach(channel => {
                    allowedChannels.push(`<#${channel}>`)
                })

                if (allowedChannels.length === 0) allowedChannels.push('None')

                const allowedRoles = [];
                result.linkland["allowedRoles"].forEach(role => {
                    allowedRoles.push(`<@&${role}>`)
                })

                if (allowedRoles.length === 0) allowedRoles.push('None')

                const allowedUsers = [];
                result.linkland["allowedUsers"].forEach(user => {
                    allowedUsers.push(`<@${user}>`)
                })

                if (allowedUsers.length === 0) allowedUsers.push('None')

                const allowedLinks = [];
                result.linkland["allowedLinks"].forEach(link => {
                    allowedLinks.push(link)
                })

                if (allowedLinks.length === 0) allowedLinks.push('None')


                const linkland = new EmbedBuilder()
                    .setTitle('Settings - LinkLand')
                    .setDescription('LinkLand is a feature that deletes links from the server and sends them to a specific channel')
                if (result.linkland["active"] === true) {
                    linkland.addFields({ name: 'Bot is currently listening links', value: 'Yes' })
                } else {
                    linkland.addFields({ name: 'Bot is currently listening links', value: 'No' })
                }
                linkland.addFields({ name: 'Channel where bot sends links', value: `<#${result.linkland["channelID"]}>` })
                linkland.addFields({ name: 'Allowed channels', value: allowedChannels.join(' ') })
                linkland.addFields({ name: 'Allowed users', value: allowedUsers.join(' ') })
                linkland.addFields({ name: 'Allowed links', value: allowedLinks.join('\n') })
                linkland.addFields({ name: 'Allowed roles', value: allowedRoles.join(' ') })

                linkland.setColor('#311432')

                

                const editLinks = new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setCustomId('activeLinks')
                            .setLabel('Listen links?')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🔗'),
                        new ButtonBuilder()
                            .setCustomId('addLink')
                            .setLabel('Add link')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🔗'),
                        new ButtonBuilder()
                            .setCustomId('removeLink')
                            .setLabel('Remove link')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🔗')
                    ])

                const editChannels = new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setCustomId('primaryChannel')
                            .setLabel('Primary channel')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('📁'),
                        new ButtonBuilder()
                            .setCustomId('addChannel')
                            .setLabel('Add channel')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('📁'),
                        new ButtonBuilder()
                            .setCustomId('removeChannel')
                            .setLabel('Remove channel')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('📁')
                    ])
                

                const editUsers = new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setCustomId('addUser')
                            .setLabel('Add user')

                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('👤'),
                        new ButtonBuilder()

                            .setCustomId('removeUser')
                            .setLabel('Remove user')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('👤'),
                        new ButtonBuilder()

                            .setCustomId('addRole')
                            .setLabel('Add role')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('👥'),
                        new ButtonBuilder()

                            .setCustomId('removeRole')
                            .setLabel('Remove role')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('👥')
                    ])

                interaction.update({ embeds: [linkland], components: [dropdown, editLinks, editChannels, editUsers], ephemeral: true })

            }
            if (interaction.values[0] === 'bullying') {
                
            }
        }
    }
    catch (err) {
        console.log(err.stack);
    }
    finally {
        DBclient.close();
    }

});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    try {
        DBclient.connect();
        const database = DBclient.db("HamburjareDB");
        const collection = database.collection("server-config");
        const filter = { _id: interaction.guild.id };
        const result = await collection.findOne(filter);
        if (interaction.customId === 'settings') {
            
        }
    }
    catch (err) {
        console.log(err.stack);
    }
    finally {
        DBclient.close();
    }

});