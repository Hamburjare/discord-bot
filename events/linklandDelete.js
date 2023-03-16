const { client, DBclient } = require('..');
const Discord = require('discord.js');

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (msg.content.includes("https://") || msg.content.includes("http://")) {
    try {
      await DBclient.connect();
      const database = DBclient.db("HamburjareDB");
      const collection = database.collection("server-config");
      const filter = { _id: msg.guild.id };



      const result = await collection.findOne(filter);
      if (result) {
        const channel = client.channels.cache.get(result.linkland["channelID"]);
        var found = false;

        if (result.linkland["channelID"] === msg.channel.id) return;
        if (result.linkland["active"] === false) return;
        if (result.linkland["allowedChannels"].includes(msg.channel.id)) return;
        if (result.linkland["allowedRoles"].includes(msg.member.roles.cache.map((r) => r.id))) return;
        if (result.linkland["allowedUsers"].includes(msg.author.id)) return;

        result.linkland["allowedLinks"].forEach(link => {
          if(msg.content.includes(link)) found = true;

        });
        if (found === true) return;
        msg.delete();
        channel.send(`${msg.author} ***laittama viesti***: ${msg.content}`);

      };
    }
    catch (err) {
      console.log(err.stack);
    }
    finally {
      await DBclient.close();
    }
  }


  // if (
  //   msg.guild.id === "692296062924488714" ||
  //   msg.content.includes("https://streamable") ||
  //   msg.channel.id === "872128881979707483" ||
  //   msg.content.includes("https://tenor.com") ||
  //   msg.content.includes("https://cdn.discordapp.com/attachments/") ||
  //   msg.channel.id === "784453087158861864" ||
  //   msg.content.includes("https://medal.tv/") || msg.content.includes("https://youtu.be/")
  // )
  //   return;



});