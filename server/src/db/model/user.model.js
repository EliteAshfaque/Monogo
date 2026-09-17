const mongoose = require('mongoose');
const userSchema = mongoose.Schema( {
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{  
        type:String,
        required:true
    },
    createdAt:{ 
        type:Date,
        default:Date.now
    },
    role:{
        type:String,
        enum:['user','artist','admin'],
        default:'user'
    }
    ,plan:{
        type:String,
        enum:['free','premium'],
        default:'free'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date


})
const userModel = mongoose.model("user", userSchema);
module.exports = userModel
