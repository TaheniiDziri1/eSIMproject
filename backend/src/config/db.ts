import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/projectesim";

export const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI); 
        console.log("Mongo connected");
    } catch(error){
        console.error("MongoDB connection error");
        process.exit(1);
    }

}