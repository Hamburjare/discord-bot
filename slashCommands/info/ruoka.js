const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const fetch = require('node-fetch');
const Keyv = require('keyv');
const keyv = new Keyv(process.env.DATABASE);
keyv.on('error', err => console.error('Keyv connection error:', err)); 

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
        const photo = await keyv.get(trim); 

        if (photo !== undefined) {
            lihaPhotos.push(photo);
        } else {
            const ruokakuva = await fetch(`https://customsearch.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API}&cx=c2aa933ac7fce44db&searchType=image&q=${trim}`); 
            const data = await ruokakuva.json(); 
            lihaPhotos.push(data.items[0].link);
            await keyv.set(trim, data.items[0].link); 
        }
    }
}

async function getVegePhotos() {
    for (let i = 0; i < vege.length; i++) {
        let trim = ltrim(vege[i].replace(/\(.*?\)/g, ""))
        trim = rtrim(trim)
        const photo = await keyv.get(trim); 

        if (photo !== undefined) {
            vegePhotos.push(photo);
        } else {
            const ruokakuva = await fetch(`https://customsearch.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API}&cx=c2aa933ac7fce44db&searchType=image&q=${trim}`); 
            const data = await ruokakuva.json(); 
            vegePhotos.push(data.items[0].link);
            await keyv.set(trim, data.items[0].link); 
        }
    }
}

async function getDessertPhotos() {
    for (let i = 0; i < dessert.length; i++) {
        let trim = ltrim(dessert[i].replace(/\(.*?\)/g, ""))
        trim = rtrim(trim)
        const photo = await keyv.get(trim); 

        if (photo !== undefined) {
            dessertPhotos.push(photo);
        } else {
            const ruokakuva = await fetch(`https://customsearch.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API}&cx=c2aa933ac7fce44db&searchType=image&q=${trim}`); 
            const data = await ruokakuva.json();  
            dessertPhotos.push(data.items[0].link);
            await keyv.set(trim, data.items[0].link); 
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
        const ruokalista = await fetch('https://www.foodandco.fi/modules/json/json/Index?costNumber=0083&language=fi');
        const data = await ruokalista.json();

        for (let i = 0; i < data.MenusForDays.length; i++) {
            if (data.MenusForDays[i].Date === currentDate() + 'T00:00:00+00:00') {
                vege = data.MenusForDays[i].SetMenus[1]?.Components;
                liha = data.MenusForDays[i].SetMenus[2]?.Components;
                dessert = data.MenusForDays[i].SetMenus[3]?.Components;

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
                { name: 'Miesten ruokaa', value: `${liha.join("\n")}`, inline: true },
                { name: 'Vegaanista paskaa', value: `${vege.join("\n")}`, inline: true },
                { name: 'Jälkiruokana', value: `${dessert.join("\n")}}`, inline: true }
            )
        } else if (liha !== undefined && vege !== undefined && dessert === undefined) {
            embed.addFields(
                { name: 'Miesten ruokaa', value: `${liha.join("\n")}`, inline: true },
                { name: 'Vegaanista paskaa', value: `${vege.join("\n")}`, inline: true },
            )
        }
        else {
            embed.addFields(
                { name: 'Miesten ruokaa', value: `Ruokalistaa ei ole saatavilla`, inline: true },
                { name: 'Vegaanista paskaa', value: `Ruokalistaa ei ole saatavilla (voi harmi)`, inline: true },
                { name: 'Jälkiruokana', value: `Ruokalistaa ei ole saatavilla`, inline: true }
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
