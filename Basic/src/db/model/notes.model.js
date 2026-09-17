const mongoose = require('mongoose');
const notesSchema = mongoose.Schema( {
    title:String,
    description:String

})
const notesModel = mongoose.model("notes",notesSchema) 
module.exports = notesModel