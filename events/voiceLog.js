const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle } = require('discord.js');
const {client, DBclient} = require('..');

client.on("voiceStateUpdate", (oldMember, newMember) => {
    let newUserChannel = newMember.channelId;
    let oldUserChannel = oldMember.channelId;
    let channel = client.channels.cache.get("895331191677394944");
  
    if (newMember.guild.id !== "784380611900604426") return;
  
    if (oldUserChannel === null) {
      const viesti = new EmbedBuilder()
        .setTitle("**Käyttäjä joinas**")
        .setDescription("<@" + newMember + "> liittyi kanavalle")
        .addFields({
          name: "Channel: ",
          value: "<#" + newUserChannel + ">",
        })
        .setColor("#2F3136")
        .setTimestamp();
      channel.send({embeds: [viesti]});
    } else if (newUserChannel === null) {
      const viesti = new EmbedBuilder()
        .setTitle("**Käyttäjä lähti**")
        .setDescription(
          "<@" + oldMember + "> lähti kanavalta"
        )
        .addFields({
          name: "Channel: ",
          value: "<#" + oldUserChannel + ">",
        })
        .setColor("#2F3136")
        .setTimestamp();
      channel.send({embeds: [viesti]});
    } else {
      if (newUserChannel === oldUserChannel) return;
      const viesti = new EmbedBuilder()
        .setTitle("**Käyttäjä siirty**")
        .setDescription(
          "<@" + oldMember + "> siirtyi toiselle kanavalle"
        )
        .addFields({
          name: "Vanha Channel: ",
          value: "<#" + oldUserChannel + ">",
        })
        .addFields({
          name: "Uus Channel: ",
          value: "<#" + newUserChannel + ">",
        })
        .setColor("#2F3136")
        .setTimestamp();
      channel.send({embeds: [viesti]});
    }
  });