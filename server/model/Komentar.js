const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const komentarSchema = new Schema({
     user: {
          type: String,
          default: "",
     },
     tekst: {
          type: String,
          default: "",
     },
     objavaId: {
          type: String,
          default: "",
     },
},
     {timestamps: true }
     );
     
     module.exports = mongoose.model('Komentar', komentarSchema);