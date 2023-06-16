const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const DATABASE = process.env.DATABASE_URL

mongoose.connect(DATABASE,{
    autoIndex:true,
    useNewUrlParser:true,
    useUniFiedTopology:true,
}).then(()=>{
    console.log("Database connection successfully")
}).catch((error)=>{
    console.log("Database connection fail",error)
})
