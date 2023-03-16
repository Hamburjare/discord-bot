const { client, DBclient } = require('..');
const Discord = require('discord.js');

function validURL(str) {
  var pattern = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?")
  return !!pattern.test(str);
}

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (validURL(msg.content)) {
    try {
      const database = DBclient.db("HamburjareDB");
      const collection = database.collection("server-config");
      const filter = { _id: msg.guild.id };

      const result = await collection.findOne(filter);

      if (result) {

        const channel = msg.guild.channels.cache.get(result.linkland["channelID"]);
        var found = false;

        if (result.linkland["channelID"] === msg.channel.id) return;
        if (result.linkland["active"] === false) return;
        if (result.linkland["allowedChannels"].includes(msg.channel.id)) return;
        if (result.linkland["allowedUsers"].includes(msg.author.id)) return;

        for (let i = 0; i < result.linkland["allowedRoles"].length; i++) {
          if (msg.member.roles.cache.has(result.linkland["allowedRoles"][i])) {
            found = true;
            break;
          }
        }

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
    
  }

});