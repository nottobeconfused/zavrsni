const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    korisnickoIme: {
        type: String,
        required: true,
        min: 2,
        max: 60,
    },
    ime: {
        type: String,
        default: "",
        min: 2,
        max: 30,
    },
    prezime: {
        type: String,
        default: "",
        min: 2,
        max: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 30,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    putDoSlike: {
        type: String,
        default: "",
    },
    putDoDatoteka: {
        type: String,
        default: "",
    },
    grupe: {
        type: Array,
        default: []
    },
    friends: {
        type: Array,
        default: []
    },
},
{timestamps: true }
);

module.exports = mongoose.model('User', userSchema);