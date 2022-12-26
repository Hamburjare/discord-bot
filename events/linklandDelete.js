const client = require('..')
const Discord = require('discord.js');

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;
    if (
      msg.guild.id === "692296062924488714" ||
      msg.content.includes("https://streamable") ||
      msg.channel.id === "872128881979707483" ||
      msg.content.includes("https://tenor.com") ||
      msg.content.includes("https://cdn.discordapp.com/attachments/") ||
      msg.channel.id === "784453087158861864" ||
      msg.content.includes("https://medal.tv/") || msg.content.includes("https://youtu.be/")
    )
      return;
    if (msg.channel.id !== "784802376669986816") {
      if (msg.content.includes("https://") + msg.content.includes("http://")) {
        let channelli = client.channels.cache.get("784802376669986816");
        msg.delete();
        channelli.send(`${msg.author} ***laittama viesti***: ${msg.content}`);
      }
    }
  });