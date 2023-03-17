const { ActionRowBuilder, Events, StringSelectMenuBuilder, EmbedBuilder, ApplicationCommandType } = require('discord.js');
const { DBclient } = require('../..');


async function CheckIfGuildHasDB(id) {
    const db = DBclient.db("HamburjareDB");
    const collection = db.collection("server-config");
    const filter = { _id: id };
    try {
        const query =
            {
                _id: id,
                messages: { COOLDOWN_MESSAGE: "You are on `<duration>` cooldown!" },
                bullying: {
                    category: ""
                },
                linkland: {
                    active: false,
                    channelID: "",
                    allowedChannels: [],
                    allowedUsers: [],
                    allowedLinks: [],
                    allowedRoles: []
                },
                admins: {
                    logChannel: "",
                    allowedUsers: [],
                    allowedRoles: []
                },
    
            }
        

        const result = await collection.findOne(filter);

        if (result === null || result === undefined) {
            await collection.insertOne(query);
        }
        

    } catch (error) {
        console.error(error);
    }

}

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
            .setColor('#311432')

        CheckIfGuildHasDB(interaction.guild.id);


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

        return interaction.reply({ embeds: [settings], ephemeral: true, components: [dropdown] })
    }

};