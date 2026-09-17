const mongoose = require('mongoose');
const userSchema = mongoose.Schema( {
    username:String,
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:String

})
const userModel = mongoose.model("user", userSchema);
module.exports = userModel
