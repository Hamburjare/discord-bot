const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');
const { client, DBclient, DBname} = require('../..');
let pingaan = false;
let pingihelvetti;
module.exports = {
    name: 'kiusaa',
    description: "Kiusaa muita",
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'kiusattava henkilö',
            type: 6,
            required: true
        }
    ],


    run: async (client, interaction) => {

        if (pingaan === false) {
            const commands = await client.application.commands.fetch()
            const command = commands.find(command => command.name === 'settings')
            const db = DBclient.db(DBname);
            const collection = db.collection("server-config");
            const result = await collection.findOne({ _id: interaction.guild.id });

            if (!result) {
                
                return await interaction.reply({ content: `Error! Use </settings:${command.id}> to configure category and channel.`, ephemeral: true });
            };

            const user = interaction.guild.members.cache.get(interaction.options.get('user').value);
            const bully = interaction.guild.members.cache.get(interaction.user.id);
            let logi = interaction.guild.channels.cache.get(result.admins["logChannel"]);


            pingaan = true;

            let pingichannel = await createChannel(interaction.guild, `kiusaus-kannu`, [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: user,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ]);
            await pingichannel.setParent(result.bullying["CATEGORY"], { lockPermissions: false });

            const viesti = new EmbedBuilder()
                .setTitle("**Sinua kiusataan**")
                .setColor("#2F3136")
                .setTimestamp();

            const viestiSecret = new EmbedBuilder()
                .setTitle("**Kiusaus aloitettu**")
                .setDescription(
                    `${user}`)
                .setColor("#2F3136")
                .setTimestamp();


            const logiViesti = new EmbedBuilder()
                .setTitle("**Kiusaus alkanut**")
                .setDescription(
                    `${bully} kiusaa: ${user}`
                )
                .setColor("#2F3136")
                .setTimestamp();
            logi.send({ embeds: [logiViesti] });
            pingihelvetti = setInterval(function () {
                pingichannel.send(`${user}`).then(msg => msg.delete().catch(console.error));
            }, 2000);

            const actionRow = new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setCustomId('lopeta')
                        .setLabel('Lopeta')
                        .setStyle(ButtonStyle.Danger)
                ])

            client.on('interactionCreate', async interaction => {
                if (!interaction.isButton()) return;
                if (interaction.customId === 'lopeta' && pingaan === true) {
                    clearInterval(pingihelvetti);
                    pingaan = false;
                    await interaction.channel.delete();
                }

            });

            await interaction.reply({ embeds: [viestiSecret], ephemeral: true })

            await pingichannel.send({ embeds: [viesti], components: [actionRow] })

            return

        }

        if (pingaan === true) {
            const errorMessage = new EmbedBuilder()
                .setTitle("**Jotakin kiusataan jo**")
                .setDescription(
                    `Yritä myöhemmin uudelleen`)
                .setColor("#2F3136")
                .setTimestamp();
            await interaction.reply({ embeds: [errorMessage], ephemeral: true })
        }

    }

};

function createChannel(guild, name, permissionOverwrites) {
    return guild.channels.create({
        name,
        permissionOverwrites,
        reason: 'Kiusaus addiktio :D',
    });
}
