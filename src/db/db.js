const mongoose = require("mongoose");


function connectDB(){

    mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected successfully");
}

module.exports = connectDB;