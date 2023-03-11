const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const objavaSchema = new Schema({
    nazivObjave: {
        type: String,
        required: true,
        min: 2,
        max: 60,
    },
    putDoDatoteka: {
        type: String,
        default: "",
    },
    tekst: {
        type: String,
        default: "",
    },
    od: {
        type: String,
        default: "",
    },
    do: {
        type: String,
        default: "",
    },
},
{timestamps: true }
);

module.exports = mongoose.model('Objava', objavaSchema);