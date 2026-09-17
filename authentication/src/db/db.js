const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function connectDB(){
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("Succesfully Connected to the DB");

    }catch(error){
    console.log("Error while connecting the DB")

    }
}
module.exports = connectDB; 
