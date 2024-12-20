import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

async function connectDB():Promise<void>{
    const url:string | undefined= process.env.mongo_url
    if(!url){
        console.log("Please specify a url to connect to");
        return
    }
    try{
        await mongoose.connect(url)
        console.log("Connected to Database ")
        
    }catch(err:unknown){
        if(err instanceof Error) console.log("Error connecting to database" + err.message)
        else{
            console.log("An unknown Error Occured ")
    }
    }
 
}

export default connectDB;