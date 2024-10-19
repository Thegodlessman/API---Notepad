import mongoose from "mongoose";
import config from "./config/config";

mongoose.connect(config.DB.URI, {
    ssl: true
  })

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('Mongodb conection true');
})

connection.on('error', err => {
    console.log(err);
    process.exit(0);
})