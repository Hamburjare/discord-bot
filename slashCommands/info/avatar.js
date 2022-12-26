const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
module.exports = {
    name: 'avatar',
    description: "Näytä avatar",
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'henkilön avatar',
            type: 6,
            required: true
        }
    ],


    run: async (client, interaction) => {
        const user = interaction.guild.members.cache.get(interaction.options.get('user').value);
        const avatar = new EmbedBuilder()
            .setTitle("**Avatar**")
            .setImage(user.displayAvatarURL({
                dynamic: true,
              }))
            .setDescription(`${user}`)
            .setColor("#2F3136")
        return interaction.reply({ embeds: [avatar]})
    }

};