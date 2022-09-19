const { truncate } = require("lodash");
const mongoose = require("mongoose");

module.exports = mongoose.model("Guild", new mongoose.Schema({

    id: { type: String }, //ID of the guild
    name: { type: String },
    registeredAt: { type: Number, default: Date.now() },
    prefix: { type: String, default: '*' },
    config: {
        color: {
            type: Object,
            default: {
                error: "#ce2020",
                success: "#40b97c",
                main: "#f9df04"
            }
        },
    },

    addons: {
        createVoc: {
            type: Object,
            default: {
                nbVoc: 0,
                channels: [],
                channelsList: [],
            },
        },
        party: {
            type: Object,
            default: {
                enabled: false,
                roleTag: { type: String },
                category: { type: String },
                nbParty: 0,
                channel_clip: { type: String },
            }
        },
        captcha: {
            type: Object,
            default: {
                channel: { type: String },
                enabled: false,
                attempts: 5,
                registerRole: { type: String }, 
            }
        },
        level: {
            type: Object,
            default: {
                enabled: false,
                chNotif: { type: String },
                taux: 1,

            }
        },
        logs: {
            type: Object,
            default: {
            enabled: false,
            channel: { type: String },
            }
        }

    }



}));