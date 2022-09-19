const mongoose = require('mongoose');
const client = require("../index");
const config = client.config;
const colors = require("colors");

module.exports = (client) => {
	console.log("[DATABASE] Started connecting to MongoDB...".brightYellow);
	const mongo = process.env.MONGO;
	
	if (!mongo) {
		console.log("[WARN] A Mongo URI/URL isn't provided! (Not required)".red);
	} else {
		mongoose.connect(mongo, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}).catch((e) => console.log(e))

		mongoose.connection.once("open", () => {
			console.log("[DATABASE] Connected to MongoDB!".brightGreen);
		})
		return;
	}
}