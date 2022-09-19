const fs = require("fs");
const client = require("../../index");

module.exports = {
  name: "guildScheduledEventUserRemove",
};

client.on("guildScheduledEventUserRemove", async (EventSched, user) => {
  //SI C'EST UNE SOIRÉE
  const path = `./tools/party/create/${EventSched.guild.id}/${EventSched.id}.json`;
  if (fs.existsSync(path)) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      let data = {};
      data.EventSched = EventSched;
      data.user = user;
      client.emit("partyUserRemove", (client, data));
    } catch (error) {
      console.error("Something went wrong when fetching the message: ", error);
      return;
    }
  }
});
