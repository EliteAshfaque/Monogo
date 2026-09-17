const mongoose = require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect('mongodb+srv://ashfaqueelite_db_user:3VItcAjsgKq027tW@cluster0.zqbllf5.mongodb.net/Post')
        console.log("Succesfully Connected to the DB");

    }catch(error){
    console.log("Error while connecting the DB")

    }
}
module.exports = connectDB; 
