const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const datotekaSchema = new Schema({
     file: {
          type: String,
          default: "",
          required: true, 
     },
     objavaId: {
          type: String,
          default: "",
     },
     userId: {
          type: String,
          default: "",
     },
     odgovorId: {
          type: String,
          default: "",
     },
},
     {timestamps: true }
     );
     
     module.exports = mongoose.model('Datoteka', datotekaSchema);