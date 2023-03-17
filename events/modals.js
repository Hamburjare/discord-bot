const { client, DBclient, DBname } = require('..');
const { LinkLand, Bullying} = require('./selectMenu.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');
const database = DBclient.db(DBname);
const collection = database.collection("server-config");
const options = { upsert: true };
var filter = undefined;
var result = undefined;

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

async function UpdatePrimaryChannel(interaction) {
    const channel = interaction.fields.getTextInputValue('primaryChannelId');
    if (!interaction.guild.channels.cache.get(channel)) return interaction.reply({ content: 'No channel found!', ephemeral: true });
    await collection.updateOne(filter, { $set: { "linkland.channelID": channel } }, options);
    LinkLand(interaction);
}

async function AddLink(interaction) {
    const link = interaction.fields.getTextInputValue('linkToAdd');
    const links = link.split(',');
    links.forEach(link => {
        link = ltrim(link);
        link = rtrim(link);
        if (!validURL(link)) links.splice(links.indexOf(link), 1);
    })
    if (links.length < 1) return interaction.reply({ content: 'No valid links found!', ephemeral: true });
    await collection.updateOne(filter, { $addToSet: { "linkland.allowedLinks": { $each: links } } }, options);
    LinkLand(interaction);
}

async function RemoveLink(interaction) {
    const link = interaction.fields.getTextInputValue('linkToRemove');
    const links = link.split(',');
    links.forEach(link => {
        link = ltrim(link);
        link = rtrim(link);
        if (!validURL(link)) links.splice(links.indexOf(link), 1);
    })
    if (links.length < 1) return interaction.reply({ content: 'No valid links found!', ephemeral: true });
    await collection.updateOne(filter, { $pull: { "linkland.allowedLinks": { $in: links } } }, options);
    LinkLand(interaction);
}

async function AddChannel(interaction) {
    const channel = interaction.fields.getTextInputValue('channelId');
    const channels = channel.split(',');
    channels.forEach(channel => {
        channel = ltrim(channel);
        channel = rtrim(channel);
        if (!interaction.guild.channels.cache.get(channel)) channels.splice(channels.indexOf(channel), 1);
    })
    if (channels.length < 1) return interaction.reply({ content: 'No valid channels found!', ephemeral: true });

    await collection.updateOne(filter, { $addToSet: { "linkland.allowedChannels": { $each: channels } } }, options);
    LinkLand(interaction);
}

async function RemoveChannel(interaction) {
    const channel = interaction.fields.getTextInputValue('channelId');
    const channels = channel.split(',');
    channels.forEach(channel => {
        channel = ltrim(channel);
        channel = rtrim(channel);
        if (!interaction.guild.channels.cache.get(channel)) channels.splice(channels.indexOf(channel), 1);
    })
    if (channels.length < 1) return interaction.reply({ content: 'No valid channels found!', ephemeral: true });

    await collection.updateOne(filter, { $pull: { "linkland.allowedChannels": { $in: channels } } }, options);
    LinkLand(interaction);
}

async function AddRole(interaction) {
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

async function RemoveRole(interaction) {
    const role = interaction.fields.getTextInputValue('roleId');
    const roles = role.split(',');
    roles.forEach(role => {
        role = ltrim(role);
        role = rtrim(role);
        if (!interaction.guild.roles.cache.get(role)) roles.splice(roles.indexOf(role), 1);
    })
    if (roles.length < 1) return interaction.reply({ content: 'No valid roles found!', ephemeral: true });

    await collection.updateOne(filter, { $pull: { "linkland.allowedRoles": { $in: roles } } }, options);

    LinkLand(interaction);
}

async function AddUser(interaction) {
    const user = interaction.fields.getTextInputValue('userId');
    const users = user.split(',');
    users.forEach(user => {
        user = ltrim(user);
        user = rtrim(user);
        if (!interaction.guild.members.cache.get(user)) users.splice(users.indexOf(user), 1);
    })
    if (users.length < 1) return interaction.reply({ content: 'No valid users found!', ephemeral: true });

    await collection.updateOne(filter, { $addToSet: { "linkland.allowedUsers": { $each: users } } }, options);

    LinkLand(interaction);
}

async function RemoveUser(interaction) {
    const user = interaction.fields.getTextInputValue('userId');
    const users = user.split(',');
    users.forEach(user => {
        user = ltrim(user);
        user = rtrim(user);
        if (!interaction.guild.members.cache.get(user)) users.splice(users.indexOf(user), 1);
    })
    if (users.length < 1) return interaction.reply({ content: 'No valid users found!', ephemeral: true });

    await collection.updateOne(filter, { $pull: { "linkland.allowedUsers": { $in: users } } }, options);
    
    LinkLand(interaction);
}

async function UpdateCategory(interaction) {
    const category = interaction.fields.getTextInputValue('categoryId');
    const categoryCheck = interaction.guild.channels.cache.find(channel => channel.id === category && channel.type === ChannelType.GuildCategory)
    if (!categoryCheck) return interaction.reply({ content: 'Invalid category!', ephemeral: true });
    await collection.updateOne(filter, { $set: {  "bullying.category": category } }, options);
    Bullying(interaction);
}

async function UpdateLogChannel(interaction) {
    const channel = interaction.fields.getTextInputValue('logChannelId');
    if (!interaction.guild.channels.cache.get(channel)) return interaction.reply({ content: 'Invalid channel!', ephemeral: true });
    await collection.updateOne(filter, { $set: {  "admins.logChannel": channel } }, options);
    Bullying(interaction);
}

async function linklandModalHandler(interaction) {
    try {
        switch (interaction.customId) {
            case 'addLinkModal':
                await AddLink(interaction);
                break;
            case 'removeLinkModal':
                await RemoveLink(interaction);
                break;
            case 'primaryChannelModal':
                await UpdatePrimaryChannel(interaction);
                break;
            case 'addChannelModal':
                await AddChannel(interaction);
                break;
            case 'removeChannelModal':
                await RemoveChannel(interaction);
                break;
            case 'addRoleModal':
                await AddRole(interaction);
                break;
            case 'removeRoleModal':
                await RemoveRole(interaction);
                break;
            case 'addUserModal':
                await AddUser(interaction);
                break;
            case 'removeUserModal':
                await RemoveUser(interaction);
                break;
        }
    } catch (err) {
        console.error(err);
    }
}

async function bullyingModalHandler(interaction) {
    try {
        switch (interaction.customId) {
            case 'categoryModal':
                await UpdateCategory(interaction);
                break;
            case 'logChannelModal':
                await UpdateLogChannel(interaction);
                break;
        }

    }
    catch (err) {
        console.error(err);
    }
}



client.on("interactionCreate", async (interaction) => {
    if (!interaction.isModalSubmit) return;
    try {

        filter = { _id: interaction.guild.id };
        result = await collection.findOne(filter);

        linklandModalHandler(interaction);
        bullyingModalHandler(interaction);

    }
    catch (err) {
        console.log(err.stack);
    }


});