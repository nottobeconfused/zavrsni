const Datoteka = require("../model/Datoteka.js");
const path = require("path");
const asyncWrapper = require("../middleware/asyncWrapper.js")

const getDatoteka = async (req, res) => {
     try{
          const items = await Datoteka.find();
          res.status(200).json({items});
     }catch (error){
          console.log(error)
     }
};

const dodajDatoteku = asyncWrapper(async (req, res) => {
     const file = req.file.path;
     const fileName = path.basename(file);
     const item = await Datoteka.create({ file: fileName });
     res.status(201).json({ item });
   });

const downloadDatoteka = asyncWrapper(async (req, res) => {
     const { id } = req.params;
     const item = await Datoteka.findById(id);
     if(!item){
          return next(new Error("No item found!"));
     }
     const file = item.file;
     const filePath = path.join(__dirname, `../${file}`);
     res.download(filePath);
});

module.exports = {
     getDatoteka,
     dodajDatoteku,
     downloadDatoteka,
};