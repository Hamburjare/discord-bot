const { client, DBclient } = require('..');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const database = DBclient.db("HamburjareDB");
const collection = database.collection("server-config");
var filter = undefined;
var result = undefined;

async function IsLinkLandActive(interaction) {
    if (result.linkland["active"] === true) {
        await collection.updateOne(filter, { $set: { "linkland.active": false } });
        interaction.reply({ content: 'LinkLand is now disabled!', ephemeral: true });
    } else {
        await collection.updateOne(filter, { $set: { "linkland.active": true } });
        interaction.reply({ content: 'LinkLand is now enabled!', ephemeral: true });
    }
}

async function AddLink(interaction) {
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

async function RemoveLink(interaction) {
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

async function EditPrimaryChannel(interaction) {
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

async function AddChannel(interaction) {
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

async function RemoveChannel(interaction) {
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

async function AddRole(interaction) {
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

async function RemoveRole(interaction) {
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

async function AddUser(interaction) {
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

async function RemoveUser(interaction) {
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

async function EditCategory(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('categoryModal')
        .setTitle('Set the category');

    const category = new TextInputBuilder()
        .setCustomId('categoryId')
        .setLabel("Category ID")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('123456789012345678')
        .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(category);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
}

async function EditLogChannel(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('logChannelModal')
        .setTitle('Set the log channel');

    const channel = new TextInputBuilder()
        .setCustomId('logChannelId')
        .setLabel("Channel ID")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('123456789012345678')
        .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(channel);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
}

async function Buttons(interaction) {
    try {
        switch (interaction.customId) {
            case 'activeLinks':
                IsLinkLandActive(interaction);
                break;
            case 'addLink':
                AddLink(interaction);
                break;
            case 'removeLink':
                RemoveLink(interaction);
                break;
            case 'primaryChannel':
                EditPrimaryChannel(interaction);
                break;
            case 'addChannel':
                AddChannel(interaction);
                break;
            case 'removeChannel':
                RemoveChannel(interaction);
                break;
            case 'addRole':
                AddRole(interaction);
                break;
            case 'removeRole':
                RemoveRole(interaction);
                break;
            case 'addUser':
                AddUser(interaction);
                break;
            case 'removeUser':
                RemoveUser(interaction);
                break;
            case 'category':
                EditCategory(interaction);
                break;
            case 'logChannel':
                EditLogChannel(interaction);
                break;


        }
    } catch (err) {
        console.log(err.stack);
        interaction.reply({ content: 'Something went wrong, try again', ephemeral: true });

    }
    

}


client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton) return;
    try {
        filter = { _id: interaction.guild.id };
        result = await collection.findOne(filter);

        Buttons(interaction);

    }
    catch (err) {
        console.log(err.stack);
    }


});