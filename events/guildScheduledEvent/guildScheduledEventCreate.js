const fs = require("fs");
const client = require("../../index");

module.exports = {
  name: "guildScheduledEventCreate",
};

client.on("guildScheduledEventCreate", async (EventSched) => {
  //SI C'EST UNE SOIRÉE
  if (EventSched.entityMetadata != null) {
    if (EventSched.entityMetadata.location.toLowerCase().startsWith("party")) {
      client.emit("partyCreate", (client, EventSched));
    }
  }
});
