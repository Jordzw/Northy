const fs = require('fs');
const client = require("../../index");

module.exports = {
    name: "guildScheduledEventUpdate",
  };
  
  client.on("guildScheduledEventUpdate", async (EventSched, newEventSched) => {

        if(EventSched.status === 1 && newEventSched.status === 2){
            client.emit('partyStarting', newEventSched, EventSched)
            console.log('starting')
        } 
        else if(newEventSched.status === 3) {
            console.log('completed')
        }
  });
  