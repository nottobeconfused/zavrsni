const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const odgovorSchema = new Schema({
    objavaId: {
        type: String,
        default: "",
    },
    datoteke: {
        type: Array,
        default: []
    },
    admin: {
        type: String,
        default: "",
    },
    komentari: {
        type: Array,
        default: []
    },
    ocjena: {
     type: String,
        default: "",
    }
},
{timestamps: true }
);

module.exports = mongoose.model('Odgovor', odgovorSchema);