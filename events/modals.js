const { client, DBclient } = require('..');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

function ltrim(str) {
    if (!str) return str;
    return str.replace(/^\s+/g, '');
}

function rtrim(str) {
    if (!str) return str;
    return str.replace(/\s+$/g, '');
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}


client.on("interactionCreate", async (interaction) => {
    if (!interaction.isModalSubmit) return;
    try {
        const database = DBclient.db("HamburjareDB");
        const collection = database.collection("server-config");
        const filter = { _id: interaction.guild.id };
        const options = { upsert: true };
        const result = await collection.findOne(filter);
        if (interaction.customId === 'addLinkModal') {
            const link = interaction.fields.getTextInputValue('linkToAdd');
            const links = link.split(',');
            links.forEach(link => {
                link = ltrim(link);
                link = rtrim(link);
                if (!validURL(link)) links.splice(links.indexOf(link), 1);
            })
            if (links.length < 1) return interaction.reply({ content: 'No valid links found!', ephemeral: true });
            await collection.updateOne(filter, { $addToSet: { "linkland.allowedLinks": { $each: links } } }, options);
            interaction.reply({ content: 'Links added!', ephemeral: true });
        }

        if (interaction.customId === 'removeLinkModal') {
            const link = interaction.fields.getTextInputValue('linkToRemove');
            const links = link.split(',');
            links.forEach(link => {
                link = ltrim(link);
                link = rtrim(link);
                if (!validURL(link)) links.splice(links.indexOf(link), 1);
            })
            if (links.length < 1) return interaction.reply({ content: 'No valid links found!', ephemeral: true });
            await collection.updateOne(filter, { $pull: { "linkland.allowedLinks": { $in: links } } }, options);
            interaction.reply({ content: 'Links removed!', ephemeral: true });
        }

        if (interaction.customId === 'primaryChannelModal') {
            const channel = interaction.fields.getTextInputValue('primaryChannelId');
            if (!interaction.guild.channels.cache.get(channel)) return interaction.reply({ content: 'No channel found!', ephemeral: true });
            await collection.updateOne(filter, { $set: { "linkland.channelID": channel } }, options);
            interaction.reply({ content: 'Channel added!', ephemeral: true });
        }

        if (interaction.customId === 'addChannelModal') {
            const channel = interaction.fields.getTextInputValue('channelId');
            const channels = channel.split(',');
            channels.forEach(channel => {
                channel = ltrim(channel);
                channel = rtrim(channel);
                if (!interaction.guild.channels.cache.get(channel)) channels.splice(channels.indexOf(channel), 1);
            })
            if (channels.length < 1) return interaction.reply({ content: 'No valid channels found!', ephemeral: true });

            await collection.updateOne(filter, { $addToSet: { "linkland.allowedChannels": { $each: channels } } }, options);
            interaction.reply({ content: 'All the valid channels added!', ephemeral: true });
        }

        if (interaction.customId === 'removeChannelModal') {
            const channel = interaction.fields.getTextInputValue('channelId');
            const channels = channel.split(',');
            channels.forEach(channel => {
                channel = ltrim(channel);
                channel = rtrim(channel);
                if (!interaction.guild.channels.cache.get(channel)) channels.splice(channels.indexOf(channel), 1);
            })
            if (channels.length < 1) return interaction.reply({ content: 'No valid channels found!', ephemeral: true });

            await collection.updateOne(filter, { $pull: { "linkland.allowedChannels": { $in: channels } } }, options);
            interaction.reply({ content: 'All the valid channels removed!', ephemeral: true });
        }

        if (interaction.customId === 'addRoleModal') {
            const role = interaction.fields.getTextInputValue('roleId');
            const roles = role.split(',');
            roles.forEach(role => {
                role = ltrim(role);
                role = rtrim(role);
                if (!interaction.guild.roles.cache.get(role)) roles.splice(roles.indexOf(role), 1);
            })
            if (roles.length < 1) return interaction.reply({ content: 'No valid roles found!', ephemeral: true });

            await collection.updateOne(filter, { $addToSet: { "linkland.allowedRoles": { $each: roles } } }, options);
            interaction.reply({ content: 'All the valid roles added!', ephemeral: true });

        }

        if (interaction.customId === 'removeRoleModal') {
            const role = interaction.fields.getTextInputValue('roleId');
            const roles = role.split(',');
            roles.forEach(role => {
                role = ltrim(role);
                role = rtrim(role);
                if (!interaction.guild.roles.cache.get(role)) roles.splice(roles.indexOf(role), 1);
            })
            if (roles.length < 1) return interaction.reply({ content: 'No valid roles found!', ephemeral: true });

            await collection.updateOne(filter, { $pull: { "linkland.allowedRoles": { $in: roles } } }, options);

            interaction.reply({ content: 'All the valid roles removed!', ephemeral: true });
        }

        if (interaction.customId === 'addUserModal') {
            const user = interaction.fields.getTextInputValue('userId');
            const users = user.split(',');
            users.forEach(user => {
                user = ltrim(user);
                user = rtrim(user);
                if (!interaction.guild.members.cache.get(user)) users.splice(users.indexOf(user), 1);
            })
            if (users.length < 1) return interaction.reply({ content: 'No valid users found!', ephemeral: true });

            await collection.updateOne(filter, { $addToSet: { "linkland.allowedUsers": { $each: users } } }, options);

            interaction.reply({ content: 'All the valid users added!', ephemeral: true });
        }

        if (interaction.customId === 'removeUserModal') {
            const user = interaction.fields.getTextInputValue('userId');
            const users = user.split(',');
            users.forEach(user => {
                user = ltrim(user);
                user = rtrim(user);
                if (!interaction.guild.members.cache.get(user)) users.splice(users.indexOf(user), 1);
            })
            if (users.length < 1) return interaction.reply({ content: 'No valid users found!', ephemeral: true });

            await collection.updateOne(filter, { $pull: { "linkland.allowedUsers": { $in: users } } }, options);

            interaction.reply({ content: 'All the valid users removed!', ephemeral: true });
        }

    }
    catch (err) {
        console.log(err.stack);
    }


});