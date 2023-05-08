const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const { DBclient, DBname } = require('../..');

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

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
        const db = DBclient.db(DBname);
        const collection = db.collection("food-pics");
        const options = { upsert: true };
        try {
            let ruoka = interaction.options.get('ruoka').value.replace(/\(.*?\)/g, "");
            let kuva = interaction.options.get('kuva').value;
            const filter = { name: ruoka };

            // Poistetaan välilyönnit alusta ja lopusta
            ruoka = ltrim(ruoka);
            ruoka = rtrim(ruoka);
            kuva = ltrim(kuva);
            kuva = rtrim(kuva);

            let ruokadb = await collection.findOne({ name: ruoka });
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

            if (validURL(kuva)) {
                await collection.updateOne(filter, { $set: { name: ruoka, link: kuva } }, options);
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
        catch (error) {
            console.error(error);
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
