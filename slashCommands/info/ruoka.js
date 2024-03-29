const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const { DBclient, DBname } = require('../..');
const fetch = require('node-fetch');
const db = DBclient.db(DBname);
const collection = db.collection("food-pics");
var options = { upsert: true };

const colors = ['#000000', '#1ABC9C', '#11806A', '#57F287', '#1F8B4C', '#3498DB', '#206694', '#9B59B6', '#71368A', '#E91E63', '#AD1457', '#F1C40F', '#C27C0E', '#E67E22', '#A84300', '#ED4245', '#992D22', '#95A5A6', '#979C9F', '#7F8C8D', '#BCC0C0', '#34495E', '#2C3E50', '#FFFF00', '#FFFFFF', '#99AAb5', '#23272A', '#2C2F33', '#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245', '#607D8B', '#546E7A', '#36393F', '#69013B'];
const lihaPhotos = [];
const vegePhotos = [];
const dessertPhotos = [];
let vege = undefined;
let liha = undefined;
let dessert = undefined;


function ltrim(str) {
    if (!str) return str;
    return str.replace(/^\s+/g, '');
}

function rtrim(str) {
    if (!str) return str;
    return str.replace(/\s+$/g, '');
}

function currentDate() {
    const date = new Date();
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function getPhotosFromGoogle(type) {
    switch (type) {
        case "liha":
            getMeatPhotos();
            break;
        case "vege":
            getVegePhotos();
            break;
        case "dessert":
            getDessertPhotos();
            break;
        default:
            break;
    }
}

async function getMeatPhotos() {
    for (let i = 0; i < liha.length; i++) {
        let trim = ltrim(liha[i].replace(/\(.*?\)/g, ""))
        trim = rtrim(trim)
        const photo = await collection.findOne({ name: trim });

        if (photo !== undefined && photo !== null) {
            lihaPhotos.push(photo.link);
        } else {
            const ruokakuva = await fetch(`https://customsearch.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API}&cx=c2aa933ac7fce44db&searchType=image&q=${trim}`);
            const data = await ruokakuva.json();
            if (!data.items[0].link.startsWith("http")) {
                lihaPhotos.push("https://i.imgur.com/ME4Ef.jpeg");
                await collection.insertOne({ name: trim, link: "https://i.imgur.com/ME4Ef.jpeg" }, options);
                continue;
            }
            lihaPhotos.push(data.items[0].link);
            await collection.insertOne({ name: trim, link: data.items[0].link }, options);;
        }
    }
}

async function getVegePhotos() {
    for (let i = 0; i < vege.length; i++) {
        let trim = ltrim(vege[i].replace(/\(.*?\)/g, ""))
        trim = rtrim(trim)
        const photo = await collection.findOne({ name: trim });

        if (photo !== undefined && photo !== null) {
            vegePhotos.push(photo.link);
        } else {
            const ruokakuva = await fetch(`https://customsearch.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API}&cx=c2aa933ac7fce44db&searchType=image&q=${trim}`);
            const data = await ruokakuva.json();
            if (!data.items[0].link.startsWith("http")) {
                vegePhotos.push("https://i.imgur.com/ME4Ef.jpeg");
                await collection.insertOne({ name: trim, link: "https://i.imgur.com/ME4Ef.jpeg" }, options);
                continue;
            }
            vegePhotos.push(data.items[0].link);
            await collection.insertOne({ name: trim, link: data.items[0].link }, options);
        }
    }
}

async function getDessertPhotos() {
    for (let i = 0; i < dessert.length; i++) {
        let trim = ltrim(dessert[i].replace(/\(.*?\)/g, ""))
        trim = rtrim(trim)
        const photo = await collection.findOne({ name: trim });

        if (photo !== undefined && photo !== null) {
            dessertPhotos.push(photo.link);
        } else {
            const ruokakuva = await fetch(`https://customsearch.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API}&cx=c2aa933ac7fce44db&searchType=image&q=${trim}`);
            const data = await ruokakuva.json();
            if (!data.items[0].link.startsWith("http")) {
                dessertPhotos.push("https://i.imgur.com/ME4Ef.jpeg");
                await collection.insertOne({ name: trim, link: "https://i.imgur.com/ME4Ef.jpeg" }, options);
                continue;
            }
            dessertPhotos.push(data.items[0].link);
            await collection.insertOne({ name: trim, link: data.items[0].link }, options);
        }
    }
}

module.exports = {
    name: 'päivänruoka',
    description: "Katso mitä on ruokana tänään",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'kuvat',
            description: 'haluatko kuvat ruoista',
            type: 5,
            required: false
        }
    ],


    run: async (client, interaction) => {
        const ruokalista = await fetch('https://www.compass-group.fi/menuapi/feed/json?costNumber=0083&language=fi');
        const data = await ruokalista.json();

        for (let i = 0; i < data.MenusForDays.length; i++) {
            if (data.MenusForDays[i].Date === currentDate() + 'T00:00:00\u002B00:00') {
                vege = data.MenusForDays[i].SetMenus[2]?.Components;
                liha = data.MenusForDays[i].SetMenus[3]?.Components;
                dessert = data.MenusForDays[i].SetMenus[5]?.Components;
            }
        }

        if (interaction.options.getBoolean('kuvat') === true) {
            if (liha !== undefined && lihaPhotos.length < 1) {
                getPhotosFromGoogle("liha");
            }
            if (vege !== undefined && vegePhotos.length < 1) {
                getPhotosFromGoogle("vege");
            }
            if (dessert !== undefined && dessertPhotos.length < 1) {
                getPhotosFromGoogle("dessert");
            }

        }



        const embed = new EmbedBuilder()
            .setTitle(`Tänään (${currentDate()}) menussa`)
            .setDescription(`[Linkki ruokalistaan](${data.RestaurantUrl})`)
            .setTimestamp();

        if (liha !== undefined && vege !== undefined && dessert !== undefined) {
            embed.addFields(
                { name: 'Liha', value: `${liha.join("\n")}`, inline: true },
                { name: 'Kasvis', value: `${vege.join("\n")}`, inline: true },
                { name: 'Jälkiruoka', value: `${dessert.join("\n")}}`, inline: true }
            )
        } else if (liha !== undefined && vege !== undefined && dessert === undefined) {
            embed.addFields(
                { name: 'Liha', value: `${liha.join("\n")}`, inline: true },
                { name: 'Kasvis', value: `${vege.join("\n")}`, inline: true },
            )
        }
        else {
            embed.addFields(
                { name: 'Liha', value: `Ruokalistaa ei ole saatavilla`, inline: true },
                { name: 'Kasvis', value: `Ruokalistaa ei ole saatavilla`, inline: true },
                { name: 'Jälkiruoka', value: `Ruokalistaa ei ole saatavilla`, inline: true }
            )
        }
        // let color = Math.floor(Math.random() * colors.length + 1);
        // embed.setColor(colors[color]);
        embed.setColor('#69013B');

        await interaction.reply({ embeds: [embed] });

        if (interaction.options.getBoolean('kuvat') === true) {

            for (let i = 0; i < lihaPhotos.length; i++) {
                const photosEmbed = new EmbedBuilder()
                    .setTitle(`${liha[i].replace(/\(.*?\)/g, "")}`)
                    .setDescription(`[Linkki kuvaan](${lihaPhotos[i]})`)
                    .setImage(lihaPhotos[i])
                await interaction.guild.channels.cache.get(interaction.channelId).send({ embeds: [photosEmbed] });
            }

            for (let i = 0; i < vegePhotos.length; i++) {
                const photosEmbed = new EmbedBuilder()
                    .setTitle(`${vege[i].replace(/\(.*?\)/g, "")}`)
                    .setDescription(`[Linkki kuvaan](${vegePhotos[i]})`)
                    .setImage(vegePhotos[i])
                await interaction.guild.channels.cache.get(interaction.channelId).send({ embeds: [photosEmbed] });
            }
            for (let i = 0; i < dessertPhotos.length; i++) {
                const photosEmbed = new EmbedBuilder()
                    .setTitle(`${dessert[i].replace(/\(.*?\)/g, "")}`)
                    .setDescription(`[Linkki kuvaan](${dessertPhotos[i]})`)
                    .setImage(dessertPhotos[i])
                await interaction.guild.channels.cache.get(interaction.channelId).send({ embeds: [photosEmbed] });
            }
        }


        lihaPhotos.length = 0;
        vegePhotos.length = 0;
        dessertPhotos.length = 0;
    }

};
