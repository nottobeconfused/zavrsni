const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const objavaSchema = new Schema({
    grupa: {
        type: String,
        default: "",
    },
    grupaId: {
        type: String,
        default: "",
    },
    nazivObjave: {
        type: String,
        default: "nova-objava"
    },
    datoteke: {
        type: Array,
        default: []
    },
    tekst: {
        type: String,
        default: "",
    },
    admin: {
        type: String,
        default: "",
    },
    komentari: {
        type: Array,
        default: []
    },
},
{timestamps: true }
);

module.exports = mongoose.model('Objava', objavaSchema);