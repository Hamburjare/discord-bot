const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');
const config = require('../../json/config.json');
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
            const user = interaction.guild.members.cache.get(interaction.options.get('user').value);
            const bully = interaction.guild.members.cache.get(interaction.user.id);
            let logi = interaction.guild.channels.cache.get(config.kiusaus["LOG_CHANNEL"]);
            pingaan = true;

            // let pingichannel = interaction.guild.channels.cache.get("819875691306811403");
        let pingichannel = await createChannel(interaction.guild, `kiusaus-kannu` , [
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: user,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
        ]);
        await pingichannel.setParent(config.kiusaus["CATEGORY"], { lockPermissions: false });

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
            pingichannel.send(`${user}`).then(msg => msg.delete());
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
                const lopetus = new EmbedBuilder()
                    .setTitle("**Lopetit kiusaamisen**")
                    .setColor("#2F3136")
                    .setTimestamp();
                interaction.channel.delete();
                clearInterval(pingihelvetti);
                pingaan = false;
                await interaction.reply({ embeds: [lopetus], ephemeral: true })
            } else {
                const lopetus = new EmbedBuilder()
                    .setTitle("**Ketään ei kiusata vielä**")
                    .setColor("#2F3136")
                    .setTimestamp();
                await interaction.reply({ embeds: [lopetus], ephemeral: true })
            }

        });

        await interaction.reply({ embeds: [viestiSecret], ephemeral: true })

        await pingichannel.send({ embeds: [viesti], components: [actionRow] })

    }

    // if (pingaan === true) {
    //     // await msg.author
    //     //     .send(
    //     //         "jotakin kiusataan jo, voit joko jatkaa kiusaamista tai lopettaa se !stoppaapingi"
    //     //     )
    //     //     .catch(console.error);
    // }

}

};

function createChannel(guild, name, permissionOverwrites) {
    return guild.channels.create({
        name,
        permissionOverwrites,
        reason: 'Kiusaus addiktio :D',
    });
}