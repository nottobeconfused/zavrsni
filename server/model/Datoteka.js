const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const datotekaSchema = new Schema({
     file: {
          type: String,
          default: "",
     }
},
     {timestamps: true }
     );
     
     module.exports = mongoose.model('Datoteka', datotekaSchema);