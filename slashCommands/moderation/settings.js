const { ActionRowBuilder, Events, StringSelectMenuBuilder, EmbedBuilder, ApplicationCommandType } = require('discord.js');


module.exports = {
    name: 'settings',
    description: "Update the settings of the server",
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    userPerms: ['Administrator'],


    run: async (client, interaction) => {
        
        const settings = new EmbedBuilder()
        .setTitle('Settings')
        .setDescription('Here you can update the settings of the server')


        // dropdown menu
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

        
        return interaction.reply({ embeds: [settings], ephemeral: true, components: [dropdown]})
    }

};