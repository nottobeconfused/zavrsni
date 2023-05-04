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
        required: true,
        min: 2,
        max: 60,
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
},
{timestamps: true }
);

module.exports = mongoose.model('Objava', objavaSchema);