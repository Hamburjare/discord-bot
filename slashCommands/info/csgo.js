const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const fetch = require('node-fetch');
const Keyv = require('keyv');
const keyv = new Keyv(process.env.DATABASE);
keyv.on('error', err => console.error('Keyv connection error:', err));


module.exports = {
    name: 'csgo',
    description: "Katso csgo pelaajien tilastoja",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'player',
            description: 'Full URL/SteamID/SteamID64/Status',
            type: 3,
            required: true
        },
        {
            name: 'type',
            description: 'Valitse mitä haluat nähdä',
            type: 3,
            required: true,
            choices: [
                {
                    name: 'All',
                    value: 'all'
                },
                {
                    name: 'MatchMaking',
                    value: 'matchmaking'
                },
                {
                    name: 'Faceit',
                    value: 'faceit'
                },
                {
                    name: 'Esportal',
                    value: 'esportal'
                }
            ]
        }
    ],


    run: async (client, interaction) => {

        let player = interaction.options.getString('player');
        // console.log(player.split("#"));
        if (player.includes('steamcommunity.com/')) {
            player = player.split('/')[4];
        }
        else if (player.includes("STEAM_1:") || player.includes("STEAM_0:")) {
            player = steamidTo64(player).toString();
        } else {
            // player = interaction.options.getString('player').matchAll("STEAM_1:");
            console.log(interaction.options.getString('player'));
        }

        console.log(player);
        const api = await fetch(`https://csgofinder.eu/api/players/${player}`);
        const data = await api.json();

        const steamProfile = new EmbedBuilder()
            .setTitle(`${data.steamProfile.username}`)
            .setURL(`${data.steamProfile.profileurl}`)
            .setDescription(`**Steam Profile**`)
            .addFields(
                { name: 'Account created', value: `${data.steamProfile.created}`, inline: false },
                { name: 'Played CS:GO since', value: `${data.steamProfile.startedPlaying}`, inline: false },
                { name: 'Time in game', value: `${data.steamProfile.timePlayed}h`, inline: false },
                { name: 'Time in match', value: `${data.steamProfile.matchTime}h`, inline: false },
                { name: 'Competitive wins', value: `${data.matchmakingData.wins}`, inline: false },
                { name: 'Rank', value: `${data.matchmakingData.rank}`, inline: false },
                { name: 'Last rank update', value: `${data.matchmakingData.rankUpdateDate}`, inline: false }
            );

        const faceitProfile = new EmbedBuilder()

            .setTitle(`${data.faceitData.username}`)
            .setURL(`https://www.faceit.com/en/players/${data.faceitData.username}`)
            .setDescription(`**Faceit Profile**`)
            .addFields(
                { name: 'Skill level', value: `${data.faceitData.skillLevel}`, inline: false },
                { name: 'Elo', value: `${data.faceitData.stats.elo}`, inline: false },
                { name: 'Matches', value: `${data.faceitData.stats.matches}`, inline: false },
                { name: 'Wins', value: `${data.faceitData.stats.wins}`, inline: false },
                { name: 'Win Rate', value: `${data.faceitData.stats.winRate}`, inline: false },
                { name: 'HS %', value: `${data.faceitData.stats.hs}%`, inline: false },
                { name: 'K/D', value: `${data.faceitData.stats.kd}`, inline: false },
                { name: 'Last match', value: `${data.faceitData.lastMatch}`, inline: false }
            );
        
        const esportalProfile = new EmbedBuilder()
            .setTitle(`${data.esportalData?.username}`)
            .setURL(`https://esportal.com/profile/${data.esportalData?.username}`)
            .setDescription(`**Esportal Profile**`)
            .addFields(
                { name: 'Skill level', value: `${data.esportalData?.skillLevel}`, inline: false },
                { name: 'Elo', value: `${data.esportalData?.stats.elo}`, inline: false },
                { name: 'Matches', value: `${data.esportalData?.stats.matches}`, inline: false },
                { name: 'Wins', value: `${data.esportalData?.stats.wins}`, inline: false },
                { name: 'Win Rate', value: `${data.esportalData?.stats.winRate}`, inline: false },
                { name: 'HS %', value: `${data.esportalData?.stats.hs}%`, inline: false },
                { name: 'K/D', value: `${data.esportalData?.stats.kd}`, inline: false }
            );

        switch (interaction.options.get('type').value) {
            case 'all':
                interaction.reply({ embeds: [steamProfile, faceitProfile, esportalProfile] });
                break;
            case 'matchmaking':
                interaction.reply({ embeds: [steamProfile] });
                break;
            case 'faceit':
                interaction.reply({ embeds: [faceitProfile] });
                break;
            case 'esportal':
                interaction.reply({ embeds: [esportalProfile] });
                break;
        }

    }

};

function steamidTo64(steamid) {
    let steam64id = 76561197960265728n;
    const id_split = steamid.split(":");
    steam64id += BigInt(id_split[2]) * 2n;
    if (id_split[1] === "1") 
        steam64id += 1n;
    return steam64id;
}




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