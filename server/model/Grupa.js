const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const grupaSchema = new Schema({
    imeGrupe: {
        type: String,
        required: true,
        min: 2,
        max: 20,
    },
    putDoDatoteka: {
        type: String,
        default: "",
    },
    users: {
        type: Array,
        default: []
    },
    objave: {
        type: Array,
        default: []
    },
    admin : {
        type: String,
        default: ""
    },
    adminIme : {
        type: String,
        default: ""
    },
},
{timestamps: true }
);

module.exports = mongoose.model('Grupa', grupaSchema);