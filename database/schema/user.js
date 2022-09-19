const mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    registeredAt: { type: Number, default: Date.now() },
}));