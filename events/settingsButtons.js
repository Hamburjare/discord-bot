const { client, DBclient } = require('..');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton) return;
    try {
        const database = DBclient.db("HamburjareDB");
        const collection = database.collection("server-config");
        const filter = { _id: interaction.guild.id };
        const result = await collection.findOne(filter);
        if (interaction.customId === 'activeLinks') {
            if (result.linkland["active"] === true) {
                await collection.updateOne(filter, { $set: { "linkland.active": false } });
                interaction.reply({ content: 'LinkLand is now disabled!', ephemeral: true });
            } else {
                await collection.updateOne(filter, { $set: { "linkland.active": true } });
                interaction.reply({ content: 'LinkLand is now enabled!', ephemeral: true });
            }
        }
        if (interaction.customId === 'addLink') {
            const modal = new ModalBuilder()
                .setCustomId('addLinkModal')
                .setTitle('Add a link');

            
            const link = new TextInputBuilder()
                .setCustomId('linkToAdd')
                .setLabel("Links (separate with a comma)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('https://example.com, https://example2.com')
                .setRequired(true);

            
            const firstActionRow = new ActionRowBuilder().addComponents(link);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === 'removeLink') {
            const modal = new ModalBuilder()
                .setCustomId('removeLinkModal')
                .setTitle('Remove a link');

            
            const link = new TextInputBuilder()
                .setCustomId('linkToRemove')
                .setLabel("Links (separate with a comma)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('https://example.com, https://example2.com')
                .setRequired(true);

            
            const firstActionRow = new ActionRowBuilder().addComponents(link);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === 'primaryChannel') {
            const modal = new ModalBuilder()
                .setCustomId('primaryChannelModal')
                .setTitle('Set the primary channel');

            const channel = new TextInputBuilder()
                .setCustomId('primaryChannelId')
                .setLabel("Channel ID")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('123456789012345678')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(channel);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === 'addChannel') {
            const modal = new ModalBuilder()
                .setCustomId('addChannelModal')
                .setTitle('Add a channel');

            const channel = new TextInputBuilder()
                .setCustomId('channelId')
                .setLabel("Channel ID (separate with a comma)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('123456789012345678')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(channel);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === 'removeChannel') {
            const modal = new ModalBuilder()
                .setCustomId('removeChannelModal')
                .setTitle('Remove a channel');

            const channel = new TextInputBuilder()
                .setCustomId('channelId')
                .setLabel("Channel ID (separate with a comma)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('123456789012345678')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(channel);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === 'addRole') {
            const modal = new ModalBuilder()
                .setCustomId('addRoleModal')
                .setTitle('Add a role');

            const role = new TextInputBuilder()
                .setCustomId('roleId')
                .setLabel("Role ID (separate with a comma)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('123456789012345678')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(role);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === 'removeRole') {
            const modal = new ModalBuilder()
                .setCustomId('removeRoleModal')
                .setTitle('Remove a role');

            const role = new TextInputBuilder()
                .setCustomId('roleId')
                .setLabel("Role ID (separate with a comma)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('123456789012345678')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(role);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === 'addUser') {
            const modal = new ModalBuilder()
                .setCustomId('addUserModal')
                .setTitle('Add a user');

            const user = new TextInputBuilder()
                .setCustomId('userId')
                .setLabel("User ID (separate with a comma)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('123456789012345678')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(user);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === 'removeUser') {
            const modal = new ModalBuilder()
                .setCustomId('removeUserModal')
                .setTitle('Remove a user');

            const user = new TextInputBuilder()
                .setCustomId('userId')
                .setLabel("User ID (separate with a comma)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('123456789012345678')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(user);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

    }
    catch (err) {
        console.log(err.stack);
    }


});