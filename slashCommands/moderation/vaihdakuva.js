const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const Keyv = require('keyv');
const keyv = new Keyv(process.env.DATABASE);
keyv.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
    name: 'vaihdakuva',
    description: "Vaihda virheellisiä ruoka kuvia",
    type: ApplicationCommandType.ChatInput,
    options: [

        {
            name: 'ruoka',
            description: 'Ruuan nimi minkä haluat muuttaa',
            type: 3,
            required: true
        },
        {
            name: 'kuva',
            description: 'Uusi kuva',
            type: 3,
            required: true
        }


    ],
    run: async (client, interaction) => {
            let ruoka = interaction.options.get('ruoka').value.replace(/\(.*?\)/g, "");
            let kuva = interaction.options.get('kuva').value;
            // Poistetaan välilyönnit alusta ja lopusta
            ruoka = ltrim(ruoka);
            ruoka = rtrim(ruoka);
            kuva = ltrim(kuva);
            kuva = rtrim(kuva);

            let ruokadb = await keyv.get(`${ruoka}`);
            if (ruokadb === undefined) {
                const embed = new EmbedBuilder()
                    .setTitle('Virheellinen ruoka')
                    .setDescription(`Ruokaa (${ruoka}) ei löytynyt tietokannasta`)
                    .setTimestamp()

                interaction.reply({ embeds: [embed] })
                return 
            }

            if (ruokadb === kuva) {
                const embed = new EmbedBuilder()
                    .setTitle('Et voi antaa samaa kuvaa')
                    .setDescription(`Tietokannasta löytyy jo antamasi [kuva](${kuva}) annetulle ruualle (${ruoka})`)
                    .setTimestamp()

                interaction.reply({ embeds: [embed] })
                return 
            }

            if (kuva.includes("https://") || kuva.includes("http://")) {
                await keyv.set(ruoka, kuva);
                const embed = new EmbedBuilder()
                    .setTitle('Kuvan vaihto onnistui')
                    .setDescription(`Ruuan (${ruoka}) kuva vaihdettiin onnistuneesti [kuvaan](${kuva})`)
                    .setImage(kuva)
                    .setTimestamp();

                interaction.reply({ embeds: [embed] })
                return 
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Virheellinen kuva')
                    .setDescription(`Kuvan vaihto epäonnistui, kuva ei ole linkki`)
                    .setColor('Red')
                    .setTimestamp()

                interaction.reply({ embeds: [embed] })
                return 
            }
    }
};

function ltrim(str) {
    if (!str) return str;
    return str.replace(/^\s+/g, '');
}

function rtrim(str) {
    if (!str) return str;
    return str.replace(/\s+$/g, '');
}
